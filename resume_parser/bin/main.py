#!/usr/bin/env python

from __future__ import print_function
from builtins import str
import logging
import os
import pandas
import textract

import lib
import field_extraction
import spacy


def main():
   
    logging.getLogger().setLevel(logging.INFO)

    # Extract data from resumes
    observations = extract()

    # Natural language processing in English
    nlp = spacy.load('en')

    # Transform data to have appropriate fields
    observations, nlp = transform(observations, nlp)

    # Load data for downstream consumption
    load(observations, nlp)

    pass


def text_extract_utf8(f):
    try:
        return str(textract.process(f), "utf-8")
    except UnicodeDecodeError as e:
        return ''

def extract():
    logging.info('Begin extract')
    
    # Reference variables
    candidate_file_agg = list()

    # Create list of candidate files
    for root, subdirs, files in os.walk(lib.get_conf('resume_directory')):
        folder_files = map(lambda x: os.path.join(root, x), files) # [os.path.join(root, x) for x in files]
        candidate_file_agg.extend(folder_files)

    # Convert list to a pandas DataFrame
    observations = pandas.DataFrame(data=candidate_file_agg, columns=['file_path'])
    logging.info('Found {} candidate files'.format(len(observations.index)))

    # Subset candidate files to supported extensions
    observations['extension'] = observations['file_path'].apply(lambda x: os.path.splitext(x)[1])
    observations = observations[observations['extension'].isin(lib.AVAILABLE_EXTENSIONS)]
    logging.info('Took candidate files with appropriate file formats. {} files remain'.
                 format(len(observations.index)))

    with open('../data/input/example_resumes/ru_resume.txt', 'r') as cv: # needs to be utf-8 encoded
        text = cv.read()

    # Attempt to extract text from files
    observations['text'] = text # observations['file_path'].apply(text_extract_utf8)

    # Archive schema and return
    lib.archive_dataset_schemas('extract', locals(), globals())
    logging.info('End extract')
    return observations


def transform(observations, nlp):
    
    logging.info('Begin transform')

    # Extract candidate name
    observations['candidate_name'] = observations['text'].apply(lambda x:
                                                                field_extraction.candidate_name_extractor(x, nlp))

    # Extract contact fields
    observations['email'] = observations['text'].apply(lambda x: lib.term_match(x, field_extraction.EMAIL_REGEX))
    observations['phone'] = observations['text'].apply(lambda x: lib.term_match(x, field_extraction.PHONE_REGEX))

    # Extract skills
    observations = field_extraction.extract_fields(observations)

    # Archive schema and return
    lib.archive_dataset_schemas('transform', locals(), globals())
    logging.info('End transform')
    return observations, nlp


def load(observations, nlp):
    logging.info('Begin load')
    output_path = os.path.join(lib.get_conf('summary_output_directory'), 'resume_summary.csv')

    logging.info('Results being output to {}'.format(output_path))
    print('Results output to {}'.format(output_path))

    observations.to_csv(path_or_buf=output_path, index_label='index', encoding='utf-8', sep=";")
    logging.info('End transform')
    pass


# Main section
if __name__ == '__main__':
    main()
