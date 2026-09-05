import random


MIN_NUMBER = 1
MAX_NUMBER = 100


def play_game() -> None:
    target = random.randint(MIN_NUMBER, MAX_NUMBER)
    attempts = 0

    print(f"Guess a number between {MIN_NUMBER} and {MAX_NUMBER}.")
    print("Enter q to quit.")

    while True:
        answer = input("Your guess: ").strip().lower()

        if answer == "q":
            print("Goodbye!")
            return

        try:
            guess = int(answer)
        except ValueError:
            print("Please enter a whole number.")
            continue

        if not MIN_NUMBER <= guess <= MAX_NUMBER:
            print(f"Please enter a number from {MIN_NUMBER} to {MAX_NUMBER}.")
            continue

        attempts += 1

        if guess < target:
            print("Too low.")
        elif guess > target:
            print("Too high.")
        else:
            print(f"Correct! You got it in {attempts} attempt(s).")
            return


def main() -> None:
    while True:
        play_game()
        if input("Play again? (y/n): ").strip().lower() != "y":
            print("Thanks for playing!")
            break


if __name__ == "__main__":
    play_game()
    
    main()
