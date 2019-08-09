# RC4
Programming assignment in Cryptography and Network Security class

## Development Requirements
1) [Git VSC](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2) [Node Package Manager](https://www.npmjs.com/get-npm)
3) [doxdox](https://doxdox.org) JSDoc documentation generator
4) [VS Code](https://code.visualstudio.com/) IDE


## Run The Program

Before you start you need to clone or download the repository
```
git clone https://github.com/semo94/RC4.git
```

### Part 1

This part has no user interface. In order to see the output, you have to run this [file](https://github.com/semo94/RC4/blob/master/Part%201/main.js) using **NodeJS** or an IDE debugger like **VS Code**. After running the file, the output will get printed on the terminal confirming that accuracy of the souce code logic.


### Part 2

This part has two html pages. You should first open the [sender.html](https://github.com/semo94/RC4/blob/master/Part%202/sender.html) in your browser.
1) Enter the desierd message with a valid key.
2) click submit and the program will tranfer you to the Receiver Interface
3) Enter the key that was provided by the sender
4) hit sumbit and the decrypted message will show up on the screen. Voila!

## View The Documentation

To view the souce code documentation of this project, from the root directory open [docs.html](https://github.com/semo94/RC4/blob/master/docs.html) in your browser

To generate an updated version of the documentation:
~~~
npm run generateDocs
~~~
