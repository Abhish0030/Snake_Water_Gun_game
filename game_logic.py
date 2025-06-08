import random

def get_computer_choice():
    return random.choice(["snake", "water", "gun"])

def decide_winner(user, computer):
    if user == computer:
        return "draw"
    elif (user == "snake" and computer == "water") or \
         (user == "water" and computer == "gun") or \
         (user == "gun" and computer == "snake"):
        return "user"
    else:
        return "computer"
