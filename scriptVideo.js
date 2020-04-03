// largeur & hauteur du jeu
let gameWidth = 800;
let gameHeight = 500;

// position initiale du snake
let snakeX = 100;
let snakeY = 200;

// position initiale de la pomme
let appleX = 600;
let appleY = 200;

// taille du snake et de la pomme
let pixelSize = 40;

// une variable qui enregistre si le jeu est terminé ou non
let gameEnded = false;
// le message à afficher quand le jeu est terminé
// on mettra soit "bravo", soit "perdu"
let message = "";

// notre modèle de machine learning, qu'on va charger ensuite
let classifier;

// la vidéo de notre webcam, qu'on va charger ensuite
let video;

// avec p5js, cette fonction est lancée en 1ère
// elle initialise le jeu
function setup() {
  // on charge le modèle
  classifier = ml5.imageClassifier("https://teachablemachine.withgoogle.com/models/qel2ORnPn/model.json");

  // ce code permet de récupérer la vidéo de la webcam
  video = createCapture(VIDEO);
  video.size(320, 240);

  // et on lance notre modèle !
  // il va essayer de deviner quel mouvement on fait
  // quand il aura trouvé, il lancera la fonction 'findMovement'
  // avec le mouvement identifié
  classifier.classify(video, findMovement);

  // notre écran de jeu fait la largeur 'gameWidth' et la hauteur 'gameHeight'
  createCanvas(gameWidth, gameHeight);
  frameRate(40);
}

// cette fonction est répétée chaque "microseconde"
// afin de mettre à jour l'affichage du jeu
function draw() {
  // si le jeu est terminé, alors on affiche le message de fin
  if (gameEnded) {
    textSize(80);
    textAlign(CENTER, CENTER);
    text(message, width / 2, height / 2);
    return;
  }

  // sinon

  // on met un fond noir
  background("black");

  // on fait le serpent
  // c'est juste un carré de couleur vert clair
  fill("lightgreen");
  square(snakeX, snakeY, pixelSize, pixelSize);

  // on fait la pomme
  // c'est juste un rond de couleur rouge-orangé
  fill("orangered");
  ellipse(appleX, appleY + pixelSize / 2, pixelSize);

  // et on vérifie si on a perdu ou gagné !
  checkWin();
  checkGameOver();
}

// les commandes
// il manque les commandes pour aller à gauche et à droite
// à vous de les mettre ;)
function goUp() {
  snakeY -= pixelSize;
  console.log('🔼 Je vais en haut 🔼');
}

function goDown() {
  snakeY += pixelSize;
  console.log('🔽 Je vais en bas 🔽');
}

function goLeft() {
  snakeX -= pixelSize;
  console.log('◀ Je vais à gauche ◀');
}

function goRight() {
  snakeX += pixelSize;
  console.log('▶ Je vais à droite ▶');
}

// cette fonction est lancée quand le modèle identifie un mouvement
function findMovement(error, results) {
  // en cas d'erreur, on l'affiche
  if (error) {
    console.error(error);
    return;
  }

  // on récupère le label du résultat
  // il s'agit des classes crées dans Teachable Machine
  let label = results[0].label;

  switch (label) {
    case 'haut':
      goUp();
      break;
    case 'bas':
      goDown();
      break;
    case 'gauche':
      goLeft();
      break;
    case 'droite':
      goRight();
      break;
  }
  // console.log(label);

  // dans tous les cas, on relance le modèle
  // pour identifier le prochain mouvement
  setTimeout(function() {
    classifier.classify(video, findMovement);
  }, 1000);
}

function checkWin() {
  if (snakeX == appleX - pixelSize / 2 && snakeY == appleY) {
    gameEnded = true;
    message = "Bravo !";
  }
}

// cette fonction vérifie si on sort du cadre noir
function checkGameOver() {
  if (snakeX < 0 || snakeX > gameWidth || snakeY > gameHeight || snakeY < 0) {
    // si on sort, alors on affiche "perdu"
    gameEnded = true;
    message = "Perdu !";
  }
}
