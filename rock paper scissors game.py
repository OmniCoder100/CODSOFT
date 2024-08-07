
import random

def game(computer,player):
    if computer=='p':
       if player=='s':
        return False
       elif player=='r':
        return True
    
    elif computer=='r':
       if player=='p':
        return False
       elif player=='s':
        return True
    
    elif computer=='s':
       if player=='r':
        return False
       elif player=='p':
        return True
    elif computer==player:
        return None
    
print("computer turn:rock{r} paper{p} or scissor{s}?")
randNo=random.randint(1,3) #random function for random integer generating
#assigning integers their string values
if randNo==1:
    computer='r'
elif randNo==2:
    computer='p'
elif randNo==3:
    computer='s'
player = input("your turn :rock{r} paper{p} or scissor{s}:-")
a=game(computer,player)#function called

print(f"computer chose {computer}")
print(f"player chose {player}")
if a== None:
    print("tie")
elif a== True:
    print("win")
elif a== False:
    print("lose")  
