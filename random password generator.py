import string
import random

if __name__=="__main__": #used to determine if a script is being run directly or if it is being imported as a module in another script.

    s1= string.ascii_lowercase
    # print(s1)
    
    s2= string.ascii_uppercase
    # print(s2)
    
    s3= string.digits
    # print(s3)
    
    s4= string.punctuation
    # print(s4)
    
    passlen=int(input("enter length of password:- "))
   
    s=[]
    s.extend(list(s1))
    s.extend(list(s2))       #concatenation by converting strings into lists
    s.extend(list(s3))
    s.extend(list(s4)) 
    # print(s)
    
    # random.shuffle(s)
    # # print(s)
 
    # print("".join(s[0:passlen]))
    
  #alternate method 
    print("your password is :-   ")
    print("".join(random.sample(s,passlen)))