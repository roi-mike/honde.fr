const white_heart = document.getElementById('fa-heart-white');
const click_heart = document.querySelector('.click-heart');
const menu_heart = document.getElementById('hear_element_authentification_div');

const img_personnage = document.getElementById('img_personnage_authentification_a');
const img_profil = document.getElementById('img_personne_element_authentification_div');

let display_menu_heart = 0
let display_menu_profil = 0

menu_heart.style.display = " none ";
img_profil.style.display = "none";


click_heart.addEventListener('click', function (param) {
    display_menu_heart= !display_menu_heart;
    if(display_menu_heart){
        menu_heart.style.display = " block ";
        white_heart.style.color = "red"
    }else{
        menu_heart.style.display = " none ";
        white_heart.style.color = "";
    }
});

img_personnage.addEventListener('click', function (param) {
    display_menu_profil= !display_menu_profil;
    if(display_menu_profil){
        img_profil.style.display = " block ";
        img_personnage.style.border = "2px solid blue";
    }else{
        img_profil.style.display = " none ";
        img_personnage.style.border = "none";
    }
});
