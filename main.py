from change_assistant import run_change_assistant

if __name__ == "__main__":
    tech = input("Enter the technology to adopt: ")
    framework = input("Enter the change framework (e.g. ADKAR): ")
    run_change_assistant(tech, framework)
