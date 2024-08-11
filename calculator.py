from tkinter import *
root= Tk()

root.geometry("444x555")
root.title("CALCULATOR by GAURAV" )
root.wm_iconbitmap(r"e:\diagram-28_24489.ico")
root.configure(background="black")


# Variable to keep track of the parenthesis state
parenthesis_open = False

def click(event):
    global scvalue,parenthesis_open
    text=event.widget.cget("text")#to extract text from button
    print(text)
    
    if text =="=":#for result
         if scvalue.get().isdigit():
             value=int(scvalue.get())
         else:
            value = eval(screen.get())#eval() fn to evaluate strings 
            scvalue.set(value)
            screen.update()
    elif text == "()":  # For toggling parenthesis
        if parenthesis_open:
            scvalue.set(scvalue.get() + ")")
            parenthesis_open = False
        else:
            scvalue.set(scvalue.get()+ "(")
            parenthesis_open = True
            
    elif text=="C":#for clearing
     scvalue.set("")
     screen.update()
    else:          #for all other keys
     scvalue.set(scvalue.get()+ text)#will show typed key on screen
     screen.update()
        
        

scvalue=StringVar()
scvalue.set("")

screen=Entry(root,textvariable=scvalue,font="lucida 51 bold")
screen.pack(fill=X,ipadx=8,padx=17,pady=10)

f = Frame(root,bg="black")

b = Button(f,text="C",padx=5,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="0",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="=",padx=6,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="/",padx=10,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="%",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)


f.pack()

f = Frame(root,bg="black")
b = Button(f,text="9",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="8",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="7",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="*",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)


b = Button(f,text=".",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)
f.pack()
                       
f = Frame(root,bg="black")
b = Button(f,text="6",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="5",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="4",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="+",padx=6,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="()",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)


f.pack()

f = Frame(root,bg="black")
b = Button(f,text="3",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="2",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="1",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="-",padx=9,pady=4,font="lucida 35 bold")
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

b = Button(f,text="ex\nit",padx=9,pady=3,font="lucida 24 bold",command = quit)
b.pack(side=LEFT,padx=4,pady=4)
b.bind("<Button-1>",click)

f.pack()
image= PhotoImage(file="c:\\Users\\gaura\\Downloads\\1182798-steveiphone-4.png")

gulia_label=Label(image=image)




root.mainloop()