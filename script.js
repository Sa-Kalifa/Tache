// index.html
// Script JavaScript pour la manipulation dynamique de la page
document.addEventListener("DOMContentLoaded", function() {
    // Récupérer les données du stockage local ou initialiser un tableau vide
    const formDataArray = JSON.parse(localStorage.getItem('formDataArray')) || [];
    let idCounter = 1; // Variable pour maintenir un compteur d'ID unique
    
    // Parcourir les données et les ajouter au tableau
    const tableBody = document.getElementById('tableBody');
    formDataArray.forEach(function(formData) {
        const newRow = document.createElement('tr'); // Création d'une nouvelle ligne dans le tableau
        // Remplissage de la ligne avec les données de la tâche
        newRow.innerHTML = `
            <td>${idCounter}</td>
            <td>${formData.nom}</td>
            <td>${formData.description}</td>
            <td>${formData.dateDebut}</td>
            <td>${formData.dateFin}</td>
            <td><input type="checkbox" id="statut"></td>
            <td>
                <!-- Bouton pour éditer la tâche, avec l'ID de la tâche en attribut data -->
                <button class="editer" data-id="${idCounter}"><i class="fas fa-edit"></i></button>
                <!-- Bouton pour supprimer la tâche -->
                <button class="supprimer"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        tableBody.appendChild(newRow); // Ajout de la nouvelle ligne au corps du tableau
        idCounter++; // Incrément du compteur d'ID
    });

    // Attacher des événements aux boutons d'édition et de suppression
    const editerButtons = document.querySelectorAll('.editer'); // Sélection de tous les boutons d'édition
    const supprimerButtons = document.querySelectorAll('.supprimer'); // Sélection de tous les boutons de suppression

    // Gestion de l'événement de clic sur les boutons d'édition
    editerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id'); // Récupération de l'ID de la tâche à éditer
            ouvrirModifierPage(id); // Appel de la fonction pour ouvrir la page de modification avec l'ID de la tâche
        });
    });

    // Fonction pour ouvrir la page Modifier.html avec l'ID de la tâche à modifier
    function ouvrirModifierPage(id) {
        localStorage.setItem('editId', id); // Stockage de l'ID de la tâche à modifier dans le stockage local
        window.location.href = 'modifier.html'; // Redirection vers la page de modification
    }

    // Gestion de l'événement de clic sur les boutons de suppression
    supprimerButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            supprimerTache(index); // Appel de la fonction pour supprimer la tâche correspondante
        });
    });

    // Fonction pour supprimer une tâche
    function supprimerTache(index) {
        formDataArray.splice(index, 1); // Suppression de la tâche du tableau de données
        localStorage.setItem('formDataArray', JSON.stringify(formDataArray)); // Mise à jour du stockage local
        window.location.reload(); // Rechargement de la page pour refléter les modifications
    }

    // Rechercher une tâche
    document.getElementById('searchInput').addEventListener('input', function() {
        const searchValue = this.value.trim().toLowerCase(); // Valeur de recherche en minuscules
        const rows = document.querySelectorAll('#tableBody tr'); // Sélection de toutes les lignes du tableau

        // Parcours de toutes les lignes du tableau
        rows.forEach(row => {
            const nom = row.children[1].textContent.toLowerCase(); // Nom de la tâche en minuscules
            const description = row.children[2].textContent.toLowerCase(); // Description de la tâche en minuscules
            const dateDebut = row.children[3].textContent.toLowerCase(); // Date de début de la tâche en minuscules
            const dateFin = row.children[4].textContent.toLowerCase(); // Date de fin de la tâche en minuscules
            const statut = row.children[5].textContent.toLowerCase(); // Statut de la tâche en minuscules

            // Vérification si la valeur de recherche est présente dans une des colonnes
            if (searchValue === '') {
                // Si la valeur de recherche est vide, afficher toutes les lignes du tableau
                row.style.display = '';
            } else {
                // Sinon, vérifier si la valeur de recherche est présente dans une des colonnes
                if (nom.includes(searchValue) || description.includes(searchValue) || dateDebut.includes(searchValue) || dateFin.includes(searchValue) || statut.includes(searchValue)) {
                    // Si la valeur de recherche est présente, afficher la ligne
                    row.style.display = '';
                } else {
                    // Sinon, masquer la ligne
                    row.style.display = 'none';
                }
            }
        });
    });
});

// Formulaire.html

document.addEventListener("DOMContentLoaded", function() {
    // Sélection du formulaire
    const form = document.getElementById('myForm');

    // Ajout d'un écouteur d'événement pour la soumission du formulaire
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le comportement par défaut du formulaire

        // Récupération des valeurs des champs du formulaire
        const nom = document.getElementById('nom').value;
        const dateDebut = document.getElementById('date_debut').value;
        const dateFin = document.getElementById('date_fin').value;
        const description = document.getElementById('description').value;

        // Création d'un objet représentant les données du formulaire
        const formData = {
            id: new Date().getTime(), // Utilisation d'un timestamp comme ID
            nom: nom,
            description: description,
            dateDebut: dateDebut,
            dateFin: dateFin,
            statut: 'En cours'
        };

        // Récupération des données du stockage local ou initialisation d'un tableau vide
        const formDataArray = JSON.parse(localStorage.getItem('formDataArray')) || [];

        // Ajout des données du formulaire au tableau des données
        formDataArray.push(formData);

        // Mise à jour des données dans le stockage local
        localStorage.setItem('formDataArray', JSON.stringify(formDataArray));

        // Redirection vers la page d'index après l'enregistrement
        window.location.href = 'index.html';

        // Réinitialisation du formulaire
        form.reset();
    });
});

// Modifier.html

document.addEventListener("DOMContentLoaded", function() {
    const editId = localStorage.getItem('editId'); // Récupération de l'ID de la tâche à modifier
    const formDataArray = JSON.parse(localStorage.getItem('formDataArray')) || []; // Récupération des données du stockage local ou initialisation d'un tableau vide
    const formData = formDataArray.find(data => data.id === parseInt(editId)); // Recherche de la tâche correspondante dans le tableau des données

    // Remplissage du formulaire avec les données existantes de la tâche à modifier
    document.getElementById('nom').value = formData.nom;
    document.getElementById('date_debut').value = formData.dateDebut;
    document.getElementById('date_fin').value = formData.dateFin;
    document.getElementById('description').value = formData.description;

    // Gestion de la soumission du formulaire de modification
    document.getElementById('myForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le comportement par défaut du formulaire

        // Mise à jour des données modifiées dans l'objet de la tâche
        formData.nom = document.getElementById('nom').value;
        formData.dateDebut = document.getElementById('date_debut').value;
        formData.dateFin = document.getElementById('date_fin').value;
        formData.description = document.getElementById('description').value;

        // Mise à jour des données dans le tableau des données
        localStorage.setItem('formDataArray', JSON.stringify(formDataArray));

        // Redirection vers la page Index.html après la modification
        window.location.href = 'index.html';
    });
});