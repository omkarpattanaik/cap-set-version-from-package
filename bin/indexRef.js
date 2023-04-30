#! /usr/bin/env node
import figlet from "figlet";
import inquirer from "inquirer";
import gradient from "gradient-string";
import * as fs from 'fs';

// Declare a variable to store the user's name
let userName;
let folderName;


const vueDefaultScript=`import { defineComponent } from 'vue'

defineComponent({
 created() {
   //do something
 },data(){
    return {}//do something 
 }
})`
  
const greet = async () => {
  
    // Displaying Geeks CLI
    console.log(gradient.pastel.multiline("Moo CLI"))

  
    // Wait for 2secs
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    // Ask the user's name
    const { name } = await inquirer.prompt({
        type: "list",
        name: "name",
        message: "Choose Framework ?",
        choices: [ "Vue", "Just wana say Hi " ]
    });


    if(name == 'Vue'){

        const { fName } = await inquirer.prompt({
            type: "input",
            name: "fName",
            message: "Enter Component Name ?"
        });
        const { scriptType } = await inquirer.prompt({
            type: "list",
            name: "scriptType",
            message: "Select Script File Type  ?",
            choices: [ "ts", "js" ]
        });

        const { styleType } = await inquirer.prompt({
            type: "list",
            name: "styleType",
            message: "Select Style File Type  ?",
            choices: [ "css", "scss" ]
        });

        folderName=fName;
        try {
            if (!fs.existsSync(folderName)) {
               fs.mkdirSync(folderName);
                const vueTags=`<script src="./${folderName}.component.${scriptType}" setup lang="${scriptType}"></script>
<style src="./${folderName}.component.${styleType}" lang="css"></style>
<template><p>${folderName} works!!</p></template>`;
                fs.appendFile(`${folderName}/${folderName}.component.vue`, vueTags, function (err) {
                    if (err) throw err;
                    console.log(`${folderName}/${folderName}.component.vue created`);
                });
                fs.appendFile(`${folderName}/${folderName}.component.${styleType}`, '', function (err) {
                    if (err) throw err;
                    console.log(`${folderName}/${folderName}.component.${styleType} created`);
                });
                fs.appendFile(`${folderName}/${folderName}.component.${scriptType}`, vueDefaultScript, function (err) {
                    if (err) throw err;
                    console.log(`${folderName}/${folderName}.component.${scriptType} created`);
                });
              
            }
          } catch (err) {
            console.error(err);
          } finally{
            console.log(gradient.pastel.multiline(`Successfully created ${folderName} component!!`))
          }
          

    }else{
        
        const { name } = await inquirer.prompt({
            type: "input",
            name: "name",
            message: "Your Name ?",
        })
        // Set the user's name
        userName=name

        // Print the welcome message
        var msg = `Hello ${userName}!`;

        console.log(gradient.pastel.multiline(msg));
        figlet(msg, (err, data) => {
            console.log(gradient.pastel.multiline(data));
        });

    }


}
  
// Call the askName function
greet();