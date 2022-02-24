import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {getFirestore, doc, setDoc} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";
  const firebaseConfig = {
    apiKey: "AIzaSyDFGIEq10EP7P-sShr2pYu929gyd7cTF5M",
    authDomain: "its-up-there.firebaseapp.com",
    projectId: "its-up-there",
    storageBucket: "its-up-there.appspot.com",
    messagingSenderId: "412955734815",
    appId: "1:412955734815:web:1c821c1f59766ab808b62a"
  };
  
  
  
   const app =initializeApp(firebaseConfig);
  const db = getFirestore(app);
 
const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
})

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    
    if(file && file.type.includes("image")){
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/uploads', {
          
            method: 'POST',
            body: formdata
            
        }).then(res => res.json())
       
        .then(data => {
      
            if(uploadType == "image"){
                addImage(data, file.name);
            } else{
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        }).catch(
            err => console.log(err));
        
    } else{
        alert("upload Image only");
    }
}

const addImage = (imagepath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
}

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

publishBtn.addEventListener('click', () => {
    if(articleField.value.length && blogTitleField.value.length){
        // generating id
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let blogTitle = blogTitleField.value.split(" ").join("-");
        let id = '';
        for(let i = 0; i < 4; i++){
            id += letters[Math.floor(Math.random() * letters.length)];
        }
// FIREBASE
        // setting up docName
        let docName = `${blogTitle}-${id}`;
        let date = new Date(); // for published at info

        setDoc(doc(db,"blogs",blogTitleField.value + Date.now()),{
            title: blogTitleField.value,
            article: articleField.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        } )
        .then(() => {
            location.href = `/${docName}`;
        })
        .catch((err) => {
            console.error(err);
        })
    }
})