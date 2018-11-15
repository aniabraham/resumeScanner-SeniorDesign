#!/usr/bin/env python

from __future__ import print_function
from builtins import str
import json
import logging
import os
import pandas
import sys

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

    candidate_file = list()
    candidate_file.append(sys.argv[1])

    # Convert list to a pandas DataFrame
    observations = pandas.DataFrame(data=candidate_file, columns=['file_path'])
    logging.info('Found {} candidate file(s)'.format(len(observations.index)))

    # Subset candidate files to supported extensions
    observations['extension'] = observations['file_path'].apply(lambda x: os.path.splitext(x)[1])
    observations = observations[observations['extension'].isin(lib.AVAILABLE_EXTENSIONS)]
    logging.info('Took candidate file(s) with appropriate file format(s). {} file(s) remain'.
                 format(len(observations.index)))

    with open(candidate_file[0], 'r') as cv: # needs to be utf-8 encoded
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
    observations['name'] = observations['text'].apply(lambda x:
                                                                field_extraction.candidate_name_extractor(x, nlp))

    # Extract contact fields
    observations['phone'] = observations['text'].apply(lambda x: lib.term_match(x, field_extraction.PHONE_REGEX))
    observations['email'] = observations['text'].apply(lambda x: lib.term_match(x, field_extraction.EMAIL_REGEX))
    
    # Extract GPA
    observations['gpa'] = observations['text'].apply(lambda x: lib.term_match(x, field_extraction.GPA_REGEX))

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
    
    education = pandas.DataFrame(columns=['university', 'degree', 'gpa', 'year'])
    experience = pandas.DataFrame(columns=['company', 'position', 'start', 'end'])
    
    education['university'] = observations['university'].iloc[0]
    education['degree'] = observations['degree'].iloc[0]
    education['gpa'] = observations['gpa'].iloc[0]
    
    experience['position'] = observations['jobs'].iloc[0]
    
    observations = observations.drop(columns=['file_path', 'extension', 'text', 'gpa', 'university', 'degree', 'jobs'])
    
    observations['phone'] = ''.join(observations['phone'].iloc[0]).rstrip()
    
    education_dict = {"university":"","degree":"","gpa":0,"year":""}
    experience_dict = {"company":"","position":"","start":"","end":""}
    
    observations['education'] = [education_dict]
    observations['experience'] = [experience_dict]
    
    observations['education'].iloc[0] = [education_dict]
    observations['experience'].iloc[0] = [experience_dict]
    
    #df.to_dict

    observations.to_csv(path_or_buf=output_path, index_label='index', encoding='utf-8', sep=";")
    print(observations.to_json(orient='records'))
    
    # Send JSON to stdout to be handled by Node.JS
    #print(json.dumps(observations))
    
    logging.info('End load')
    pass


# Main section
if __name__ == '__main__':
    main()
