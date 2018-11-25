from builtins import str
import logging

import lib

EMAIL_REGEX = r"([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)"
PHONE_REGEX = r"1?\W*([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})(\se?x?t?(\d*))?"
GPA_REGEX = r"([\d]\.[\d]{1,2}\/[\d]\.[\d]{1,2}|[\d]\.[\d]{1,2})" #r"[\d]\.[\d]{1,2}"


def candidate_name_extractor(input_string, nlp):

    input_string = str(input_string)

    tokenized_input = input_string.split()
	
    firstName = ''
    lastName = ''
    check = False
    a = 0
    for x in tokenized_input:
        if (a == 2):
            break
        if (x.isupper() & (a == 0)):
            check = True
            firstName = x
        if (x.isupper() & (a == 1)):
            check = True
            lastName = x
        a += 1
        
    if (check == False):
        doc = nlp(input_string)

        # Extract entities
        doc_entities = doc.ents

        # Takes subset of person type entities
        doc_persons = [x for x in doc_entities if x.label_ == 'PERSON'] # filter(lambda x: x.label_ == 'PERSON', doc_entities)
        doc_persons = [x for x in doc_persons if len(x.text.strip().split()) >= 2] # filter(lambda x: len(x.text.strip().split()) >= 2, doc_persons) 
        doc_persons = [x.text.strip() for x in doc_persons] # list(map(lambda x: x.text.strip(), doc_persons)) 

        # Assuming that the first Person entity with more than two tokens is the candidate's name
        if doc_persons:
            return doc_persons[0]
        return "NOT FOUND"
    else:
        first = firstName.lower().capitalize()
        last = lastName.lower().capitalize()
        return first + ' ' + last

def company_name_extractor(input_string, nlp):
    
    doc = nlp(input_string)
    
    doc_entities = doc.ents
    
    doc_companies = [x for x in doc_entities if x.label_ == 'ORG']
    doc_companies = [x.text.strip() for x in doc_companies]
    
    if doc_companies:
    	return doc_companies
    return "NOT FOUND"

def extract_fields(df):
    for extractor, items_of_interest in list(lib.get_conf('extractors').items()):
        df[extractor] = df['text'].apply(lambda x: extract_skills(x, extractor, items_of_interest))
    return df


def extract_skills(resume_text, extractor, items_of_interest):
    potential_skills_dict = dict()
    matched_skills = set()

    # TODO This skill input formatting could happen once per run, instead of once per observation.
    for skill_input in items_of_interest:

        # Format list inputs
        if type(skill_input) is list and len(skill_input) >= 1:
            potential_skills_dict[skill_input[0]] = skill_input

        # Format string inputs
        elif type(skill_input) is str:
            potential_skills_dict[skill_input] = [skill_input]
        else:
            logging.warn('Unknown skill listing type: {}. Please format as either a single string or a list of strings'
                         ''.format(skill_input))

    for (skill_name, skill_alias_list) in list(potential_skills_dict.items()):

        skill_matches = 0
        # Iterate through aliases
        for skill_alias in skill_alias_list:
            # Add the number of matches for each alias
            skill_matches += lib.term_count(resume_text, skill_alias.lower())

        # If at least one alias is found, add skill name to set of skills
        if skill_matches > 0:
            matched_skills.add(skill_name)

    return matched_skills
