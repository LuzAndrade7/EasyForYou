// Sistema de Cuestionarios - EAS for you
// Maneja preguntas de opción múltiple y actividades de clasificación

const QuizSystem = {
  currentQuiz: null,
  currentQuestionIndex: 0,
  totalScore: 0,
  timerInterval: null,
  timeRemaining: 0,
  startTime: 0,
  
  // Datos de cuestionarios por tema
  quizzes: {
    // TEMA 1: Segmentación de Mercado
    topic1: {
      title: "Segmentación de Mercado",
      maxPoints: 25,
      questions: [
        {
          type: "multiple-choice",
          question: "¿Qué es segmentación de mercado?",
          options: [
            "Conocer quiénes van a ser tus clientes.",
            "Determinar un área geográfica para poner tu emprendimiento.",
            "Analizar información contable y administrativa."
          ],
          correct: 0,
          time: 30,
          points: 10
        },
        {
          type: "classification",
          question: "Clasifica los siguientes elementos según el tipo de segmentación:",
          categories: {
            "Segmentación Demográfica": ["Edad", "Sexo", "Género", "Ingresos", "Profesión"],
            "Segmentación Psicográfica": ["Personalidad", "Estilo de Vida", "Clase Social"],
            "Segmentación Geográfica": ["Ubicación Geográfica", "Clima", "País", "Ciudad", "Parroquia", "Cantón"]
          },
          time: 60,
          points: 15
        }
      ]
    },
    
    // TEMA 2: Margen de Ganancia
    topic2: {
      title: "Margen de Ganancia",
      maxPoints: 40,
      questions: [
        {
          type: "multiple-choice",
          question: "¿Qué es el margen de ganancias?",
          options: [
            "El total de ingresos sin considerar los costos",
            "La cantidad de productos vendidos en un negocio",
            "El dinero que se guarda en el banco",
            "La diferencia entre ingresos y costos expresada como ganancia"
          ],
          correct: 3,
          time: 30,
          points: 10
        },
        {
          type: "multiple-choice",
          question: "¿Cuál es la fórmula correcta del margen de ganancias?",
          options: [
            "Costos ÷ Ingresos × 100",
            "(Ingresos − Costos) ÷ Ingresos × 100",
            "Ingresos − Precio",
            "Costos + Ingresos"
          ],
          correct: 1,
          time: 45,
          points: 15
        },
        {
          type: "multiple-choice",
          question: "Si un producto se vende en $50 y su costo es $30, ¿qué representa el margen de ganancias?",
          options: [
            "La ganancia obtenida al restar el costo al precio de venta",
            "El total de ventas del negocio",
            "El precio del producto",
            "El dinero invertido"
          ],
          correct: 0,
          time: 45,
          points: 15
        }
      ]
    },
    
    // TEMA 3: Precio de Venta Unitario
    topic3: {
      title: "Precio de Venta Unitario",
      maxPoints: 30,
      questions: [
        {
          type: "multiple-choice",
          question: "¿Qué es el costo unitario de producción?",
          options: [
            "El dinero que gana el vendedor por cada producto",
            "El precio final que paga el cliente",
            "El costo total dividido para las unidades producidas",
            "El margen de ganancia del producto"
          ],
          correct: 2,
          time: 30,
          points: 10
        },
        {
          type: "multiple-choice",
          question: "¿Cuál de los siguientes es un costo variable?",
          options: [
            "Alquiler del local",
            "Sueldo administrativo",
            "Materias primas",
            "Servicios básicos fijos"
          ],
          correct: 2,
          time: 30,
          points: 10
        },
        {
          type: "multiple-choice",
          question: "¿Para qué sirve calcular el precio unitario de venta?",
          options: [
            "Para saber cuántos empleados se necesitan",
            "Para fijar el precio del producto y obtener ganancia",
            "Para reducir los costos fijos",
            "Para eliminar los costos variables"
          ],
          correct: 1,
          time: 30,
          points: 10
        }
      ]
    },
    
    // TEMA 4: Punto de Equilibrio
    topic4: {
      title: "Punto de Equilibrio",
      maxPoints: 35,
      questions: [
        {
          type: "multiple-choice",
          question: "¿Qué representa el punto de equilibrio en una empresa?",
          options: [
            "El momento en el que la empresa obtiene una ganancia significativa",
            "El punto en el que los ingresos totales son iguales a los costos totales",
            "El momento en que los costos fijos superan los costos variables",
            "El punto en el que los ingresos son mayores que los costos variables"
          ],
          correct: 1,
          time: 45,
          points: 15
        },
        {
          type: "multiple-choice",
          question: "¿Qué tipo de costos no cambian aunque se venda más o menos?",
          options: [
            "Costos variables",
            "Costos fijos",
            "Costos de producción",
            "Costos de comercialización"
          ],
          correct: 1,
          time: 30,
          points: 10
        },
        {
          type: "multiple-choice",
          question: "En el gráfico del punto de equilibrio, ¿qué representa la intersección de las dos líneas inclinadas?",
          image: "./images/PuntoEqulibrio.png",
          options: [
            "Los costos variables",
            "El costo total",
            "El punto de equilibrio",
            "Los ingresos totales"
          ],
          correct: 2,
          time: 30,
          points: 10
        }
      ]
    },
    
    // TEMA 5: Balance General
    topic5: {
      title: "Balance General",
      maxPoints: 20,
      questions: [
        {
          type: "multiple-choice",
          question: "¿Qué información principal presenta el balance general de una empresa?",
          options: [
            "Los ingresos y gastos durante un período determinado.",
            "La situación financiera de la empresa en una fecha específica.",
            "El flujo de efectivo mensual de la empresa.",
            "El detalle de las ventas realizadas en el año."
          ],
          correct: 1,
          time: 30,
          points: 10
        },
        {
          type: "multiple-choice",
          question: "¿Cuál de los siguientes elementos forma parte del pasivo en el balance general?",
          options: [
            "Maquinaria",
            "Cuentas por cobrar",
            "Préstamos bancarios",
            "Capital social"
          ],
          correct: 2,
          time: 30,
          points: 10
        }
      ]
    },
    
    // ACTIVIDAD EXTRA: Clasificación Contable
    extra: {
      title: "Actividad Extra - Clasificación Contable",
      maxPoints: 60,
      questions: [
        {
          type: "classification",
          question: "Clasifica los siguientes elementos entre Activo, Pasivo y Patrimonio:",
          description: `
            <div class="classification-info">
              <div class="info-box activo-info">
                <strong>ACTIVO</strong><br>
                <small>Naturaleza: Deudora</small><br>
                <em>Todos los bienes que posee la empresa</em>
              </div>
              <div class="info-box pasivo-info">
                <strong>PASIVO</strong><br>
                <small>Naturaleza: Acreedora</small><br>
                <em>Todas las obligaciones que tiene la empresa</em>
              </div>
              <div class="info-box patrimonio-info">
                <strong>PATRIMONIO</strong><br>
                <small>Naturaleza: Acreedora</small><br>
                <em>Todos los derechos sobre la empresa</em>
              </div>
            </div>
          `,
          categories: {
            "ACTIVO": ["Bancos", "Efectivo", "Vehículos", "Cuentas por Cobrar", "Equipos de Cómputo"],
            "PASIVO": ["Cuentas por Pagar", "IVA por Pagar", "Deudas", "Obligaciones", "Sueldos por pagar"],
            "PATRIMONIO": ["Acciones", "Reservas", "Capital de la empresa"]
          },
          time: 90,
          points: 60
        }
      ]
    }
  },
  
  // Iniciar cuestionario
  startQuiz(topicId) {
    const quiz = this.quizzes[topicId];
    if (!quiz) {
      console.error("Quiz no encontrado:", topicId);
      return;
    }
    
    this.currentQuiz = quiz;
    this.currentQuestionIndex = 0;
    this.totalScore = 0;
    
    this.showQuizModal(topicId);
    this.showQuestion();
  },
  
  // Mostrar modal del cuestionario
  showQuizModal(topicId) {
    // Remover modal existente si hay uno
    const existingModal = document.getElementById('quizModal');
    if (existingModal) {
      existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'quizModal';
    modal.className = 'quiz-modal';
    modal.innerHTML = `
      <div class="quiz-modal-content">
        <div class="quiz-header">
          <h2 class="quiz-title">${this.currentQuiz.title}</h2>
          <div class="quiz-progress">
            <span id="questionCounter">Pregunta 1 de ${this.currentQuiz.questions.length}</span>
            <div class="progress-bar">
              <div class="progress-fill" id="progressFill"></div>
            </div>
          </div>
        </div>
        
        <div class="quiz-timer">
          <div class="timer-circle" id="timerCircle">
            <span id="timerText">30</span>
          </div>
          <span class="timer-label">segundos</span>
        </div>
        
        <div class="quiz-body" id="quizBody">
          <!-- Contenido de la pregunta -->
        </div>
        
        <div class="quiz-footer">
          <div class="score-display">
            Puntaje: <span id="currentScore">0</span> pts
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Agregar estilos si no existen
    if (!document.getElementById('quizStyles')) {
      this.addQuizStyles();
    }
  },
  
  // Mostrar pregunta actual
  showQuestion() {
    const question = this.currentQuiz.questions[this.currentQuestionIndex];
    const quizBody = document.getElementById('quizBody');
    
    // Actualizar contador
    document.getElementById('questionCounter').textContent = 
      `Pregunta ${this.currentQuestionIndex + 1} de ${this.currentQuiz.questions.length}`;
    
    // Actualizar barra de progreso
    const progress = ((this.currentQuestionIndex) / this.currentQuiz.questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    
    if (question.type === 'multiple-choice') {
      this.showMultipleChoice(question, quizBody);
    } else if (question.type === 'classification') {
      this.showClassification(question, quizBody);
    }
    
    // Iniciar temporizador
    this.startTimer(question.time, question.points);
  },
  
  // Mostrar pregunta de opción múltiple
  showMultipleChoice(question, container) {
    let imageHtml = '';
    if (question.image) {
      imageHtml = `<img src="${question.image}" alt="Imagen de la pregunta" class="question-image">`;
    }
    
    container.innerHTML = `
      <div class="question-container">
        <p class="question-text">${question.question}</p>
        ${imageHtml}
        <div class="options-container">
          ${question.options.map((opt, idx) => `
            <button class="option-btn" data-index="${idx}" onclick="QuizSystem.selectOption(${idx})">
              <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
              <span class="option-text">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  },
  
  // Mostrar actividad de clasificación
  showClassification(question, container) {
    const categories = Object.keys(question.categories);
    const allItems = [];
    
    // Recopilar todos los elementos y mezclarlos
    categories.forEach(cat => {
      question.categories[cat].forEach(item => {
        allItems.push({ item, category: cat });
      });
    });
    
    // Mezclar elementos
    this.shuffleArray(allItems);
    
    container.innerHTML = `
      <div class="classification-container">
        <p class="question-text">${question.question}</p>
        ${question.description || ''}
        
        <div class="drag-items" id="dragItems">
          ${allItems.map((obj, idx) => `
            <div class="drag-item" draggable="true" data-item="${obj.item}" data-correct="${obj.category}" id="item-${idx}">
              ${obj.item}
            </div>
          `).join('')}
        </div>
        
        <div class="drop-zones">
          ${categories.map(cat => `
            <div class="drop-zone" data-category="${cat}">
              <h4 class="zone-title">${cat}</h4>
              <div class="zone-items" id="zone-${cat.replace(/\s+/g, '-')}"></div>
            </div>
          `).join('')}
        </div>
        
        <button class="submit-classification-btn" onclick="QuizSystem.submitClassification()">
          ✓ Terminar Clasificación
        </button>
      </div>
    `;
    
    // Inicializar drag and drop
    this.initDragAndDrop();
  },
  
  // Inicializar drag and drop
  initDragAndDrop() {
    const items = document.querySelectorAll('.drag-item');
    const zones = document.querySelectorAll('.drop-zone');
    const dragItemsContainer = document.getElementById('dragItems');
    
    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.id);
        item.classList.add('dragging');
      });
      
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
      });
      
      // Soporte para touch
      item.addEventListener('touchstart', (e) => {
        item.classList.add('dragging');
      });
    });
    
    zones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });
      
      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });
      
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        
        const itemId = e.dataTransfer.getData('text/plain');
        const item = document.getElementById(itemId);
        
        if (item) {
          const zoneItems = zone.querySelector('.zone-items');
          zoneItems.appendChild(item);
        }
      });
    });
    
    // Permitir devolver items al contenedor original
    if (dragItemsContainer) {
      dragItemsContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
      
      dragItemsContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData('text/plain');
        const item = document.getElementById(itemId);
        if (item) {
          dragItemsContainer.appendChild(item);
        }
      });
    }
  },
  
  // Mezclar array
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },
  
  // Iniciar temporizador
  startTimer(seconds, maxPoints) {
    this.timeRemaining = seconds;
    this.startTime = Date.now();
    
    const timerText = document.getElementById('timerText');
    const timerCircle = document.getElementById('timerCircle');
    
    // Reset timer visual
    timerCircle.classList.remove('warning', 'danger');
    timerText.textContent = seconds;
    
    // Limpiar intervalo anterior
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      timerText.textContent = this.timeRemaining;
      
      // Cambiar color según tiempo restante
      const percentRemaining = (this.timeRemaining / seconds) * 100;
      if (percentRemaining <= 25) {
        timerCircle.classList.add('danger');
        timerCircle.classList.remove('warning');
      } else if (percentRemaining <= 50) {
        timerCircle.classList.add('warning');
      }
      
      // Tiempo agotado
      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeout();
      }
    }, 1000);
  },
  
  // Calcular puntaje basado en tiempo
  calculateScore(maxPoints, totalTime, timeUsed) {
    // Si responde en menos de la mitad del tiempo = puntaje completo
    // Si responde al final = mitad del puntaje
    // Escala lineal entre ambos
    
    const halfTime = totalTime / 2;
    
    if (timeUsed <= halfTime) {
      // Respondió rápido, puntaje máximo
      return maxPoints;
    } else {
      // Escala lineal desde puntaje máximo hasta mitad
      const remainingTime = totalTime - halfTime;
      const timeOverHalf = timeUsed - halfTime;
      const ratio = 1 - (timeOverHalf / remainingTime) * 0.5;
      return Math.round(maxPoints * ratio);
    }
  },
  
  // Seleccionar opción
  selectOption(index) {
    clearInterval(this.timerInterval);
    
    const question = this.currentQuiz.questions[this.currentQuestionIndex];
    const timeUsed = question.time - this.timeRemaining;
    const isCorrect = index === question.correct;
    
    // Deshabilitar todas las opciones
    const options = document.querySelectorAll('.option-btn');
    options.forEach((opt, idx) => {
      opt.disabled = true;
      if (idx === question.correct) {
        opt.classList.add('correct');
      } else if (idx === index && !isCorrect) {
        opt.classList.add('incorrect');
      }
    });
    
    // Calcular puntaje
    let earnedPoints = 0;
    if (isCorrect) {
      earnedPoints = this.calculateScore(question.points, question.time, timeUsed);
      this.totalScore += earnedPoints;
      document.getElementById('currentScore').textContent = this.totalScore;
    }
    
    // Mostrar feedback
    this.showFeedback(isCorrect, earnedPoints, question.points);
    
    // Continuar después de un delay
    setTimeout(() => {
      this.nextQuestion();
    }, 2000);
  },
  
  // Enviar clasificación
  submitClassification() {
    clearInterval(this.timerInterval);
    
    const question = this.currentQuiz.questions[this.currentQuestionIndex];
    const timeUsed = question.time - this.timeRemaining;
    
    let correctCount = 0;
    let totalItems = 0;
    
    // Verificar cada categoría
    Object.keys(question.categories).forEach(category => {
      const expectedItems = question.categories[category];
      totalItems += expectedItems.length;
      
      const zoneId = `zone-${category.replace(/\s+/g, '-')}`;
      const zone = document.getElementById(zoneId);
      
      if (zone) {
        const placedItems = zone.querySelectorAll('.drag-item');
        placedItems.forEach(item => {
          const itemCorrectCategory = item.dataset.correct;
          if (itemCorrectCategory === category) {
            correctCount++;
            item.classList.add('correct-item');
          } else {
            item.classList.add('incorrect-item');
          }
        });
      }
    });
    
    // Calcular puntaje proporcional
    const proportion = correctCount / totalItems;
    const basePoints = Math.round(question.points * proportion);
    const earnedPoints = this.calculateScore(basePoints, question.time, timeUsed);
    
    this.totalScore += earnedPoints;
    document.getElementById('currentScore').textContent = this.totalScore;
    
    // Deshabilitar botón
    const submitBtn = document.querySelector('.submit-classification-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = `${correctCount}/${totalItems} correctos`;
    }
    
    // Mostrar feedback
    const isFullyCorrect = correctCount === totalItems;
    this.showFeedback(isFullyCorrect, earnedPoints, question.points, `${correctCount}/${totalItems} elementos correctos`);
    
    // Continuar después de un delay
    setTimeout(() => {
      this.nextQuestion();
    }, 3000);
  },
  
  // Manejar tiempo agotado
  handleTimeout() {
    const question = this.currentQuiz.questions[this.currentQuestionIndex];
    
    if (question.type === 'multiple-choice') {
      // Mostrar respuesta correcta
      const options = document.querySelectorAll('.option-btn');
      options.forEach((opt, idx) => {
        opt.disabled = true;
        if (idx === question.correct) {
          opt.classList.add('correct');
        }
      });
    } else if (question.type === 'classification') {
      // Auto-enviar clasificación
      this.submitClassification();
      return;
    }
    
    this.showFeedback(false, 0, question.points, '¡Tiempo agotado!');
    
    setTimeout(() => {
      this.nextQuestion();
    }, 2000);
  },
  
  // Mostrar feedback con video del gato
  showFeedback(isCorrect, earnedPoints, maxPoints, extraMessage = '') {
    // Mostrar video del gato (feliz o triste)
    this.showCatReaction(isCorrect);
    
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackDiv.innerHTML = `
      <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
      <div class="feedback-text">
        ${isCorrect ? '¡Correcto!' : '¡Incorrecto!'}
        ${extraMessage ? `<br><small>${extraMessage}</small>` : ''}
      </div>
      <div class="feedback-points">
        +${earnedPoints} pts ${earnedPoints < maxPoints && isCorrect ? `<small>(de ${maxPoints})</small>` : ''}
      </div>
    `;
    
    document.querySelector('.quiz-body').appendChild(feedbackDiv);
  },
  
  // Siguiente pregunta
  nextQuestion() {
    this.currentQuestionIndex++;
    
    if (this.currentQuestionIndex < this.currentQuiz.questions.length) {
      this.showQuestion();
    } else {
      this.showResults();
    }
  },
  
  // Mostrar resultados
  showResults() {
    const maxPoints = this.currentQuiz.maxPoints;
    const percentage = Math.round((this.totalScore / maxPoints) * 100);
    
    // Incrementar contador de quizzes completados
    const quizzesCompleted = parseInt(localStorage.getItem('quizzesCompleted') || '0');
    localStorage.setItem('quizzesCompleted', quizzesCompleted + 1);
    console.log('Quizzes completados:', quizzesCompleted + 1);
    
    // Reproducir sonido de completar
    this.playSound('complete');
    
    let message = '';
    let emoji = '';
    
    if (percentage >= 90) {
      message = '¡Excelente! ¡Eres un experto!';
      emoji = '🏆';
    } else if (percentage >= 70) {
      message = '¡Muy bien! ¡Sigue así!';
      emoji = '⭐';
    } else if (percentage >= 50) {
      message = '¡Buen intento! Puedes mejorar.';
      emoji = '👍';
    } else {
      message = '¡No te rindas! Repasa el tema.';
      emoji = '💪';
    }
    
    const quizBody = document.getElementById('quizBody');
    quizBody.innerHTML = `
      <div class="results-container">
        <div class="results-emoji">${emoji}</div>
        <h2 class="results-title">¡Cuestionario Completado!</h2>
        <div class="results-score">
          <div class="score-big">${this.totalScore}</div>
          <div class="score-max">de ${maxPoints} puntos</div>
        </div>
        <div class="results-percentage">${percentage}%</div>
        <p class="results-message">${message}</p>
        <div class="results-buttons">
          <button class="result-btn primary" onclick="QuizSystem.saveAndClose()">
            🐾 Guardar Puntos y Continuar
          </button>
        </div>
      </div>
    `;
    
    // Ocultar timer
    document.querySelector('.quiz-timer').style.display = 'none';
  },
  
  // Guardar puntos y cerrar
  async saveAndClose() {
    // Guardar puntos en la mascota
    await this.savePointsToPet(this.totalScore);
    this.closeQuiz();
  },
  
  // Guardar puntos en la mascota
  async savePointsToPet(points) {
    try {
      const auth = window.firebaseAuth;
      const db = window.firebaseDb;
      
      if (!auth || !db) {
        console.log("Firebase no disponible, puntos guardados localmente");
        this.savePointsLocally(points);
        return;
      }
      
      const user = auth.currentUser;
      if (!user) {
        console.log("Usuario no autenticado, puntos guardados localmente");
        this.savePointsLocally(points);
        return;
      }
      
      // Obtener datos actuales del avatar
      const avatarDoc = await db.collection("avatars").doc(user.uid).get();
      
      if (!avatarDoc.exists) {
        console.error("Error obteniendo avatar: no existe");
        this.savePointsLocally(points);
        return;
      }
      
      const avatar = avatarDoc.data();
      
      // Calcular nuevo XP y nivel
      const newXP = (avatar.xp || 0) + points;
      const newLevel = Math.min(5, Math.floor(newXP / 30) + 1); // Cada 30 puntos sube de nivel, máximo nivel 5
      
      // Actualizar en la base de datos
      await db.collection("avatars").doc(user.uid).update({ 
        xp: newXP, 
        level: newLevel 
      });
      
      console.log(`¡Puntos guardados! XP: ${newXP}, Nivel: ${newLevel}`);
      
      // Mostrar notificación de nivel si subió
      if (newLevel > avatar.level) {
        this.showLevelUpNotification(newLevel);
      }
      
    } catch (error) {
      console.error("Error guardando puntos:", error);
      this.savePointsLocally(points);
    }
  },
  
  // Guardar puntos localmente (fallback)
  savePointsLocally(points) {
    const currentPoints = parseInt(localStorage.getItem('quizPoints') || '0');
    localStorage.setItem('quizPoints', currentPoints + points);
    console.log("Puntos guardados localmente:", currentPoints + points);
  },
  
  // Mostrar notificación de subida de nivel con video del gato
  showLevelUpNotification(newLevel) {
    // Reproducir sonido de celebración
    this.playSound('levelUp');
    
    // Crear overlay de celebración con video
    const overlay = document.createElement('div');
    overlay.className = 'level-up-overlay';
    overlay.id = 'levelUpOverlay';
    overlay.innerHTML = `
      <div class="level-up-modal">
        <div class="confetti-container">
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
        </div>
        <h2 class="level-up-title">🎉 ¡SUBISTE DE NIVEL! 🎉</h2>
        <div class="cat-video-container">
          <video autoplay playsinline class="cat-level-video" id="catLevelVideo">
            <source src="./videos/GatoNivel${Math.min(newLevel - 1, 4)}.mp4" type="video/mp4">
          </video>
        </div>
        <div class="level-badge">
          <span class="level-number">NIVEL ${newLevel}</span>
        </div>
        <p class="level-up-message">¡Tu gatito ha crecido!</p>
        <button class="close-level-btn" onclick="QuizSystem.closeLevelUpOverlay()">¡Genial! ✨</button>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // Mostrar con animación
    setTimeout(() => {
      overlay.classList.add('show');
    }, 100);
    
    // Configurar video para que se repita o esperar a que termine
    const video = overlay.querySelector('#catLevelVideo');
    if (video) {
      video.loop = true; // El video se repite hasta que el usuario cierre
    }
    
    // Permitir cerrar con Escape
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.closeLevelUpOverlay();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  },
  
  // Cerrar overlay de level up
  closeLevelUpOverlay() {
    const overlay = document.querySelector('.level-up-overlay');
    if (overlay) {
      overlay.classList.remove('show');
      setTimeout(() => overlay.remove(), 500);
    }
  },
  
  // Mostrar reacción del gato (feliz o triste) - video completo con sonido
  showCatReaction(isHappy) {
    const videoSrc = isHappy ? './videos/GatoFeliz.mp4' : './videos/GatoTriste.mp4';
    
    // Reproducir sonido
    this.playSound(isHappy ? 'success' : 'error');
    
    const catReaction = document.createElement('div');
    catReaction.className = 'cat-reaction-container';
    catReaction.innerHTML = `
      <video autoplay muted playsinline class="cat-reaction-video" id="catReactionVideo">
        <source src="${videoSrc}" type="video/mp4">
      </video>
    `;
    
    document.body.appendChild(catReaction);
    
    // Mostrar
    setTimeout(() => {
      catReaction.classList.add('show');
    }, 50);
    
    // Esperar a que termine el video
    const video = catReaction.querySelector('video');
    video.onended = () => {
      catReaction.classList.remove('show');
      setTimeout(() => catReaction.remove(), 300);
    };
    
    // Fallback: ocultar después de 4 segundos si el video no termina
    setTimeout(() => {
      if (document.body.contains(catReaction)) {
        catReaction.classList.remove('show');
        setTimeout(() => catReaction.remove(), 300);
      }
    }, 4000);
  },
  
  // Cerrar cuestionario
  closeQuiz() {
    const modal = document.getElementById('quizModal');
    if (modal) {
      modal.classList.add('closing');
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
    
    // Limpiar intervalo
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  },
  
  // Sistema de sonidos
  playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
      case 'success':
        // Sonido alegre de éxito
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
        break;
        
      case 'error':
        // Sonido de error
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
        
      case 'levelUp':
        // Fanfarria de subida de nivel
        const playNote = (freq, startTime, duration) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.setValueAtTime(freq, audioContext.currentTime + startTime);
          gain.gain.setValueAtTime(0.3, audioContext.currentTime + startTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
          osc.start(audioContext.currentTime + startTime);
          osc.stop(audioContext.currentTime + startTime + duration);
        };
        // Fanfarria: C-E-G-C(alto)
        playNote(523.25, 0, 0.15);    // C5
        playNote(659.25, 0.15, 0.15); // E5
        playNote(783.99, 0.3, 0.15);  // G5
        playNote(1046.50, 0.45, 0.4); // C6
        break;
        
      case 'click':
        // Sonido de click
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
        break;
        
      case 'complete':
        // Sonido de completar quiz
        const playNoteComplete = (freq, startTime, duration) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          osc.frequency.setValueAtTime(freq, audioContext.currentTime + startTime);
          gain.gain.setValueAtTime(0.25, audioContext.currentTime + startTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
          osc.start(audioContext.currentTime + startTime);
          osc.stop(audioContext.currentTime + startTime + duration);
        };
        playNoteComplete(392, 0, 0.2);     // G4
        playNoteComplete(523.25, 0.2, 0.2); // C5
        playNoteComplete(659.25, 0.4, 0.2); // E5
        playNoteComplete(783.99, 0.6, 0.4); // G5
        break;
    }
  },
  
  // Agregar estilos CSS
  addQuizStyles() {
    const styles = document.createElement('style');
    styles.id = 'quizStyles';
    styles.textContent = `
      /* Modal del cuestionario */
      .quiz-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      }
      
      .quiz-modal.closing {
        animation: fadeOut 0.3s ease forwards;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      .quiz-modal-content {
        background: linear-gradient(135deg, #0828DB 0%, #7391FF 100%);
        border-radius: 20px;
        width: 95%;
        max-width: 700px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        animation: slideUp 0.4s ease;
      }
      
      @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      /* Header */
      .quiz-header {
        background: rgba(255, 255, 255, 0.15);
        padding: 20px 25px;
        border-radius: 20px 20px 0 0;
      }
      
      .quiz-title {
        color: white;
        margin: 0 0 15px;
        font-size: 24px;
        text-align: center;
      }
      
      .quiz-progress {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      
      #questionCounter {
        color: white;
        font-size: 14px;
        white-space: nowrap;
      }
      
      .progress-bar {
        flex: 1;
        height: 8px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        overflow: hidden;
      }
      
      .progress-fill {
        height: 100%;
        background: #4CAF50;
        transition: width 0.3s ease;
        border-radius: 4px;
      }
      
      /* Timer */
      .quiz-timer {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
      }
      
      .timer-circle {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
      }
      
      .timer-circle.warning {
        background: #FFC107;
      }
      
      .timer-circle.danger {
        background: #f44336;
        animation: pulse 0.5s infinite;
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      #timerText {
        font-size: 32px;
        font-weight: bold;
        color: #333;
      }
      
      .timer-circle.danger #timerText {
        color: white;
      }
      
      .timer-label {
        color: white;
        margin-top: 8px;
        font-size: 14px;
      }
      
      /* Body */
      .quiz-body {
        padding: 25px;
        position: relative;
      }
      
      .question-container {
        background: white;
        border-radius: 15px;
        padding: 25px;
      }
      
      .question-text {
        font-size: 18px;
        color: #333;
        margin: 0 0 20px;
        line-height: 1.5;
      }
      
      .question-image {
        max-width: 100%;
        border-radius: 10px;
        margin-bottom: 20px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      
      /* Opciones */
      .options-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .option-btn {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px 20px;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
      }
      
      .option-btn:hover:not(:disabled) {
        border-color: #0828DB;
        background: #f0f4ff;
        transform: translateX(5px);
      }
      
      .option-btn:disabled {
        cursor: not-allowed;
      }
      
      .option-btn.correct {
        border-color: #4CAF50;
        background: #e8f5e9;
      }
      
      .option-btn.incorrect {
        border-color: #f44336;
        background: #ffebee;
      }
      
      .option-letter {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background: #0828DB;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
      }
      
      .option-btn.correct .option-letter {
        background: #4CAF50;
      }
      
      .option-btn.incorrect .option-letter {
        background: #f44336;
      }
      
      .option-text {
        font-size: 16px;
        color: #333;
      }
      
      /* Clasificación */
      .classification-container {
        background: white;
        border-radius: 15px;
        padding: 25px;
      }
      
      .classification-info {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 20px;
      }
      
      .info-box {
        padding: 10px;
        border-radius: 8px;
        text-align: center;
        font-size: 12px;
      }
      
      .activo-info { background: #e3f2fd; border: 2px solid #2196F3; }
      .pasivo-info { background: #ffebee; border: 2px solid #f44336; }
      .patrimonio-info { background: #e8f5e9; border: 2px solid #4CAF50; }
      
      .drag-items {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        padding: 15px;
        background: #f5f5f5;
        border-radius: 10px;
        min-height: 60px;
        margin-bottom: 20px;
      }
      
      .drag-item {
        background: #F89B54;
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        cursor: grab;
        font-size: 14px;
        transition: all 0.2s ease;
        user-select: none;
      }
      
      .drag-item:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      }
      
      .drag-item.dragging {
        opacity: 0.5;
        cursor: grabbing;
      }
      
      .drag-item.correct-item {
        background: #4CAF50 !important;
      }
      
      .drag-item.incorrect-item {
        background: #f44336 !important;
      }
      
      .drop-zones {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
      }
      
      .drop-zone {
        background: #fafafa;
        border: 2px dashed #ccc;
        border-radius: 10px;
        padding: 10px;
        min-height: 120px;
        transition: all 0.2s ease;
      }
      
      .drop-zone.drag-over {
        border-color: #0828DB;
        background: #e8f0ff;
      }
      
      .zone-title {
        text-align: center;
        color: #333;
        margin: 0 0 10px;
        font-size: 14px;
        padding-bottom: 8px;
        border-bottom: 1px solid #ddd;
      }
      
      .zone-items {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-height: 50px;
      }
      
      .zone-items .drag-item {
        font-size: 12px;
        padding: 8px 12px;
      }
      
      .submit-classification-btn {
        width: 100%;
        padding: 15px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .submit-classification-btn:hover:not(:disabled) {
        background: #43a047;
        transform: translateY(-2px);
      }
      
      .submit-classification-btn:disabled {
        background: #9e9e9e;
        cursor: not-allowed;
      }
      
      /* Feedback */
      .quiz-feedback {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px 40px;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: popIn 0.3s ease;
        z-index: 10;
      }
      
      @keyframes popIn {
        from { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
      
      .quiz-feedback.correct {
        border: 3px solid #4CAF50;
      }
      
      .quiz-feedback.incorrect {
        border: 3px solid #f44336;
      }
      
      .feedback-icon {
        font-size: 48px;
        margin-bottom: 10px;
      }
      
      .quiz-feedback.correct .feedback-icon {
        color: #4CAF50;
      }
      
      .quiz-feedback.incorrect .feedback-icon {
        color: #f44336;
      }
      
      .feedback-text {
        font-size: 20px;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
      }
      
      .feedback-points {
        font-size: 24px;
        font-weight: bold;
        color: #F89B54;
      }
      
      /* Footer */
      .quiz-footer {
        padding: 15px 25px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 0 0 20px 20px;
        text-align: center;
      }
      
      .score-display {
        color: white;
        font-size: 18px;
      }
      
      #currentScore {
        font-weight: bold;
        font-size: 24px;
      }
      
      /* Resultados */
      .results-container {
        background: white;
        border-radius: 15px;
        padding: 40px;
        text-align: center;
      }
      
      .results-emoji {
        font-size: 80px;
        margin-bottom: 20px;
      }
      
      .results-title {
        color: #333;
        margin: 0 0 25px;
      }
      
      .results-score {
        margin-bottom: 15px;
      }
      
      .score-big {
        font-size: 64px;
        font-weight: bold;
        color: #0828DB;
      }
      
      .score-max {
        font-size: 18px;
        color: #666;
      }
      
      .results-percentage {
        font-size: 32px;
        font-weight: bold;
        color: #4CAF50;
        margin-bottom: 15px;
      }
      
      .results-message {
        font-size: 18px;
        color: #666;
        margin-bottom: 30px;
      }
      
      .results-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
      }
      
      .result-btn {
        padding: 15px 30px;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .result-btn.primary {
        background: #0828DB;
        color: white;
      }
      
      .result-btn.primary:hover {
        background: #061fa8;
        transform: translateY(-2px);
      }
      
      .result-btn.secondary {
        background: #e0e0e0;
        color: #333;
      }
      
      .result-btn.secondary:hover {
        background: #d0d0d0;
      }
      
      /* Level Up Overlay con Video del Gato */
      .level-up-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 200000;
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      
      .level-up-overlay.show {
        opacity: 1;
      }
      
      .level-up-modal {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 30px;
        padding: 40px;
        text-align: center;
        max-width: 450px;
        width: 90%;
        position: relative;
        box-shadow: 0 0 60px rgba(255, 215, 0, 0.5);
        border: 3px solid #FFD700;
        animation: levelUpPulse 2s infinite;
      }
      
      @keyframes levelUpPulse {
        0%, 100% { box-shadow: 0 0 60px rgba(255, 215, 0, 0.5); }
        50% { box-shadow: 0 0 80px rgba(255, 215, 0, 0.8); }
      }
      
      .level-up-title {
        color: #FFD700;
        font-size: 28px;
        margin: 0 0 20px;
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        animation: titleGlow 1s infinite alternate;
      }
      
      @keyframes titleGlow {
        from { text-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
        to { text-shadow: 0 0 40px rgba(255, 215, 0, 0.9); }
      }
      
      .cat-video-container {
        width: 250px;
        height: 250px;
        margin: 20px auto;
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid #FFD700;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
      }
      
      .cat-level-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .level-badge {
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        padding: 15px 40px;
        border-radius: 50px;
        display: inline-block;
        margin: 15px 0;
      }
      
      .level-number {
        font-size: 24px;
        font-weight: bold;
        color: #1a1a2e;
      }
      
      .level-up-message {
        color: #fff;
        font-size: 18px;
        margin: 15px 0;
      }
      
      .close-level-btn {
        background: linear-gradient(135deg, #0828DB 0%, #7391FF 100%);
        color: white;
        border: none;
        padding: 15px 40px;
        font-size: 18px;
        font-weight: bold;
        border-radius: 30px;
        cursor: pointer;
        margin-top: 15px;
        transition: transform 0.3s, box-shadow 0.3s;
      }
      
      .close-level-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 30px rgba(8, 40, 219, 0.5);
      }
      
      /* Confetti */
      .confetti-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
      }
      
      .confetti {
        position: absolute;
        width: 10px;
        height: 10px;
        top: -10px;
        animation: confettiFall 3s linear infinite;
      }
      
      .confetti:nth-child(1) { left: 10%; background: #FFD700; animation-delay: 0s; }
      .confetti:nth-child(2) { left: 25%; background: #FF6B6B; animation-delay: 0.2s; }
      .confetti:nth-child(3) { left: 40%; background: #4ECDC4; animation-delay: 0.4s; }
      .confetti:nth-child(4) { left: 55%; background: #0828DB; animation-delay: 0.6s; }
      .confetti:nth-child(5) { left: 70%; background: #FF6B6B; animation-delay: 0.8s; }
      .confetti:nth-child(6) { left: 85%; background: #FFD700; animation-delay: 1s; }
      .confetti:nth-child(7) { left: 15%; background: #4ECDC4; animation-delay: 1.2s; }
      .confetti:nth-child(8) { left: 60%; background: #7391FF; animation-delay: 1.4s; }
      
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
      }
      
      /* Cat Reaction (Feliz/Triste) */
      .cat-reaction-container {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        overflow: hidden;
        z-index: 150000;
        opacity: 0;
        transform: scale(0.5) translateY(50px);
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        border: 3px solid #FFD700;
      }
      
      .cat-reaction-container.show {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      
      .cat-reaction-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      /* Legacy Level Up Notification (fallback) */
      .level-up-notification {
        position: fixed;
        top: 20px;
        right: -400px;
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 100000;
        transition: right 0.5s ease;
      }
      
      .level-up-notification.show {
        right: 20px;
      }
      
      .level-up-content {
        text-align: center;
        color: #333;
      }
      
      .level-up-emoji {
        font-size: 40px;
        margin-bottom: 10px;
      }
      
      .level-up-content h3 {
        margin: 0 0 5px;
      }
      
      .level-up-content p {
        margin: 0;
        font-size: 16px;
      }
      
      .level-up-content small {
        color: #666;
      }
      
      /* Responsive */
      @media (max-width: 600px) {
        .quiz-modal-content {
          width: 98%;
          max-height: 95vh;
        }
        
        .quiz-header {
          padding: 15px 20px;
        }
        
        .quiz-title {
          font-size: 20px;
        }
        
        .quiz-body {
          padding: 15px;
        }
        
        .question-text {
          font-size: 16px;
        }
        
        .option-btn {
          padding: 12px 15px;
        }
        
        .option-letter {
          width: 30px;
          height: 30px;
        }
        
        .timer-circle {
          width: 65px;
          height: 65px;
        }
        
        #timerText {
          font-size: 26px;
        }
        
        .classification-info {
          grid-template-columns: 1fr;
        }
        
        .drop-zones {
          grid-template-columns: 1fr;
        }
        
        .results-container {
          padding: 25px;
        }
        
        .results-emoji {
          font-size: 60px;
        }
        
        .score-big {
          font-size: 48px;
        }
      }
    `;
    document.head.appendChild(styles);
  }
};

// Hacer disponible globalmente
window.QuizSystem = QuizSystem;
