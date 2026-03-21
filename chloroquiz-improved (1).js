
// ChloroQuiz — Script optimisé
// Version: 2026-03-21-v23

// Variables globales
let userLevel = 'beginner';
let userErrors = JSON.parse(localStorage.getItem('quizErrors')) || [];

// Fonction pour afficher les modales de manière accessible
document.addEventListener('DOMContentLoaded', () => {
  // Initialisation de l'application
  console.log('ChloroQuiz chargé avec succès.');
  
  // Exemple de logique pour le quiz
  const quizOptions = document.querySelectorAll('.qopt');
  quizOptions.forEach(option => {
    option.addEventListener('click', function() {
      if (this.classList.contains('correct')) {
        this.classList.add('correct');
      } else {
        this.classList.add('wrong');
        userErrors.push({
          plant: 'Exemple de plante',
          error: true
        });
        localStorage.setItem('quizErrors', JSON.stringify(userErrors));
      }
    });
  });
  
  // Sauvegarde des erreurs pour un quiz personnalisé
  function saveErrors() {
    localStorage.setItem('quizErrors', JSON.stringify(userErrors));
  }
  
  // Exemple de fonction pour afficher une modale de manière accessible
  function showModal(title, message) {
    const modal = document.createElement('div');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="modal-bg">
        <div class="cel-card">
          <h3>${title}</h3>
          <p>${message}</p>
          <button class="cel-btn" onclick="this.parentElement.parentElement.remove()">Fermer</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Exemple d'utilisation
  showModal('Bravo !', 'Vous avez répondu correctement à cette question.');
});
