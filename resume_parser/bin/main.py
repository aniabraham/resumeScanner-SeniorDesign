#!/usr/bin/env python

from __future__ import print_function
from builtins import str
import logging
import os
import pandas

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

def extract():
    logging.info('Begin extract')
    
    """
    # Use for batch parsing
    candidate_file_agg = list()

    for root, subdirs, files in os.walk(lib.get_conf('resume_directory')):
        folder_files = map(lambda x: os.path.join(root, x), files) # [os.path.join(root, x) for x in files]
        candidate_file_agg.extend(folder_files)
    """

    candidate_file = sys.argv[1]

    # Convert list to a pandas DataFrame
    observations = pandas.DataFrame(data=candidate_file, columns=['file_path'])
    logging.info('Found {} candidate file(s)'.format(len(observations.index)))

    # Subset candidate files to supported extensions
    observations['extension'] = observations['file_path'].apply(lambda x: os.path.splitext(x)[1])
    observations = observations[observations['extension'].isin(lib.AVAILABLE_EXTENSIONS)]
    logging.info('Took candidate file(s) with appropriate file format(s). {} file(s) remain'.
                 format(len(observations.index)))

    with open(candidate_file, 'r') as cv: # needs to be utf-8 encoded
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

    # Extract GPA
    observations['gpa'] = observations['text'].apply(lambda x: lib.term_match(x, field_extraction.GPA_REGEX)

    # Extract skills
    observations = field_extraction.extract_fields(observations)

    # Archive schema and return
    lib.archive_dataset_schemas('transform', locals(), globals())
    logging.info('End transform')
    return observations, nlp


def load(observations, nlp):

    # Extract file name from path
    filename = os.path.basename(sys.argv[1])

    logging.info('Begin load')
    output_path = os.path.join(lib.get_conf('summary_output_directory'), 'resume_summary.csv')
    json_path = os.path.splitext(filename)[0] + '.json'

    logging.info('Results being output to {}'.format(output_path))
    # print('Results output to {}'.format(output_path))

    # observations.to_csv(path_or_buf=output_path, index_label='index', encoding='utf-8', sep=";")
    observations.to_json(orient='records', path_or_buf=json_path)
    
    # Send JSON to stdout to be handled by Node.JS
    print(observations)
    
    logging.info('End load')
    pass


# Main section
if __name__ == '__main__':
    main()
