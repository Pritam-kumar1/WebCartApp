// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import {firebaseConfig} from "./first.js";





  
const app = initializeApp(firebaseConfig);

const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")
const savedForLaterListInDB = ref(database, "savedForLaterList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const cartButton = document.getElementById("Cart-button")
const saveForLaterButton = document.getElementById("Later-button")
const savedForLaterList = document.getElementById("saved-for-later-list")
const errorPhara = document.getElementById("error");



addButtonEl.addEventListener("click", async function() {
    errorPhara.style.display = 'none';
    if(inputFieldEl.value){
        inputFieldEl.style.border = '0px';
        let inputValue = inputFieldEl.value;
        let flag1,flag2;
        
        flag1 = await dublicateInCart(inputValue);
        flag2 = await dublicateInSavedForLater(inputValue);

        if(!flag1 && !flag2){
            push(shoppingListInDB,inputValue)
        }
        if(flag1){
            errorPhara.style.display = 'block';
            errorPhara.textContent = 'Item already in Cart';
        }
        if(flag2){
            errorPhara.style.display = 'block';
            errorPhara.textContent = 'Item already in Saved To Cart';
        }
    }
    else{
        inputFieldEl.style.border = '1px solid red';
    }
    clearInputFieldEl()
})

cartButton.addEventListener("click", handleCartButton)

window.addEventListener("load", handleCartButton)


saveForLaterButton.addEventListener("click", ()=>{
    saveForLaterButton.style.backgroundColor = '#432000';
    cartButton.style.backgroundColor = '#AC485A';
    savedForLaterList.style.display = 'flex';
    shoppingListEl.style.display = 'none';
    onValue(savedForLaterListInDB, function(snapshot) {
        if (snapshot.exists()) {
            let itemsArray = Object.entries(snapshot.val())        
            clearSavedForLaterListEl()            
            for (let i = 0; i < itemsArray.length; i++) {
                let currentItem = itemsArray[i]               
                appendItemToShoppingListElforLater(currentItem)
            }    
        } else {
            savedForLaterList.innerHTML = "No items here... yet"
        }
    })
})



function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearSavedForLaterListEl() {
    savedForLaterList.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function handleCartButton(){
    saveForLaterButton.style.backgroundColor = '#AC485A';
    cartButton.style.backgroundColor = '#432000';
    savedForLaterList.style.display = 'none';
    shoppingListEl.style.display = 'flex';
    onValue(shoppingListInDB, function(snapshot) {
        if (snapshot.exists()) {
            let itemsArray = Object.entries(snapshot.val())        
            clearShoppingListEl()            
            for (let i = 0; i < itemsArray.length; i++) {
                let currentItem = itemsArray[i]                
                appendItemToShoppingListEl(currentItem)
            }    
        } else {
            shoppingListEl.innerHTML = "No items here... yet"
        }
    })
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]    
    let newEl = document.createElement("li")
    let button = document.createElement("button") 

    let img = document.createElement("img")
    img.setAttribute('src','/bookmark-regular.svg')
    img.setAttribute('id','Save')

    newEl.textContent = itemValue 

    newEl.appendChild(button)
    button.appendChild(img)

    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })    
    shoppingListEl.append(newEl)

    img.addEventListener("mouseover",(event)=>{
        event.target.setAttribute('src','/bookmark-solid.svg')
    })
    img.addEventListener("mouseout",(event)=>{
        event.target.setAttribute('src','/bookmark-regular.svg')
    })
    img.addEventListener("click",(event)=>{
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
        push(savedForLaterListInDB,itemValue)
    })
  
}




function appendItemToShoppingListElforLater(item){
    let itemID = item[0]
    let itemValue = item[1]    
    let newEl = document.createElement("li")
    let button = document.createElement("button") 

    let img = document.createElement("img")
    img.setAttribute('src','/bookmark-solid.svg')
    

    newEl.textContent = itemValue 

    newEl.appendChild(button)
    button.appendChild(img)    
    
    
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `savedForLaterList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })   
    savedForLaterList.append(newEl)

    img.addEventListener("mouseover",(event)=>{
        event.target.setAttribute('src','/bookmark-regular.svg')
    })
    img.addEventListener("mouseout",(event)=>{
        event.target.setAttribute('src','/bookmark-solid.svg')
    })
    img.addEventListener("click",(event)=>{
        let exactLocationOfItemInDB = ref(database, `savedForLaterList/${itemID}`)
        remove(exactLocationOfItemInDB)
        push(shoppingListInDB,itemValue)
    })
}

async function dublicateInCart(inputValue){
    let flag;
    onValue(shoppingListInDB,function(snapshot) {
        if (snapshot.exists()) {  
            let itemsArray = Object.entries(snapshot.val())           
            for (let i = 0; i < itemsArray.length; i++) {
                let currentItem = itemsArray[i]
                if(inputValue.toLowerCase()==currentItem[1].toLowerCase()){
                    flag=true;
                    break;
                }      
            }    
        } else {
            flag = false;
        }
    })
    return flag
    
}
async function dublicateInSavedForLater(inputValue){
    let flag;
    onValue(savedForLaterListInDB,   function(snapshot) {
        if (snapshot.exists()) {  
            let itemsArray = Object.entries(snapshot.val())           
            for (let i = 0; i < itemsArray.length; i++) {
                let currentItem = itemsArray[i]
                if(inputValue.toLowerCase()==currentItem[1].toLowerCase()){
                    flag=true;
                    break;
                }      
            }    
        } else {
            flag = false;
        }
    })
    return flag
}