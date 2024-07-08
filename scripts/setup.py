import os
import json


class Control:
    def __init__(self):
        try:
            os.mkdir(
                (
                    os.path.join(
                        os.path.dirname(os.path.dirname(__file__)), "scripts/data"
                    )
                )
            )
        except FileExistsError:
            pass

        self.activity_data = []

    def entry_check(self, input_dict, required):

        accepted_keys = set(required.keys())
        dict_keys = set(input_dict.keys())

        missing_keys = accepted_keys - dict_keys
        additional_keys = dict_keys - accepted_keys

        incorrect_types = {}
        for key in accepted_keys:
            if key in input_dict and not isinstance(input_dict[key], required[key]):
                incorrect_types[key] = required[key]

        accepted = (
            len(missing_keys) == 0
            and len(additional_keys) == 0
            and len(incorrect_types) == 0
        )
        return {
            "accepted": accepted,
            "Missing key/values": list(missing_keys),
            "Extra key/values not needed": list(additional_keys),
            "Incorrect types": incorrect_types,
        }

    def process_data(self):
        dir_list = os.listdir(
            (os.path.join(os.path.dirname(os.path.dirname(__file__)), "scripts/data"))
        )
        errors = {"Missing key/values": [], "Extra key/values not needed": [], "Incorrect types": []}
        json_format = {
            "fitnessActivity": str,
            "startTime": str,
            "endTime": str,
            "duration": str,
            "segment": list,
            "aggregate": list,
        }
        error_count = 0

        for file_name in dir_list:
            json_file = open(
                os.path.join(
                    os.path.dirname(os.path.dirname(__file__)),
                    "scripts/data/" + file_name,
                )
            )
            current_file = json.load(json_file)
            results = self.entry_check(current_file, json_format)

            if results["accepted"]:
                self.activity_data.append(current_file)
                continue

            for error_type in ["Missing key/values", "Extra key/values not needed", "Incorrect types"]:
                if results[error_type]:
                    errors[error_type].append(file_name)
            error_count += 1

        print(f"{len(self.activity_data)} successfully added.")
       
        if error_count:
            print(f"{error_count} error(s) encountered.\n---")

            for error in errors:
                if not errors[error]:
                    continue
                print(f'{error}:')
                for case in errors[error]:
                    print(case)
                print("--")

        if not self.activity_data:
            return
        else:
            with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), "src/assets/test.json"), 'w') as f:
                json.dump(self.activity_data, f)

start = Control()
start.process_data()
