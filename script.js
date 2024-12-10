document.addEventListener('DOMContentLoaded', () => {
	const burgerBtn = document.getElementById('burger-btn')
	const closeBtn = document.getElementById('close-btn')
	const navMenu = document.getElementById('nav-menu')
	const increaseBtn = document.querySelector('.increase')
	const contrastBtn = document.querySelector('.contrast')
	const searchField = document.querySelector('.search-field')
	const searchButton = document.querySelector('.search')
	const buttons = document.querySelectorAll('.btn-more')
	const achieveSection = document.querySelector('.achieve')
	const accessibilityButton = document.getElementById('accessibilityButton')
	const accessibilityOptions = document.getElementById('accessibilityOptions')
	const body = document.body
	let clickCount = 0
	let originalFontSize = {}
	let currentIndex = 0
	let searchResults = []
	let query = ''

	// Funkcja otwierająca menu
	burgerBtn.addEventListener('click', () => {
		navMenu.classList.add('active')
	})

	// Funkcja zamykająca menu
	closeBtn.addEventListener('click', () => {
		navMenu.classList.remove('active')
	})

	const menuLinks = navMenu.querySelectorAll('a') // Pobierz wszystkie linki w menu
	menuLinks.forEach(link => {
		link.addEventListener('click', () => {
			navMenu.classList.remove('active') // Zamknij menu
		})
	})

	// Funkcja przechowująca oryginalne rozmiary czcionek
	function storeOriginalFontSizes() {
		const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a, .btn-more')
		textElements.forEach(element => {
			const currentFontSize = window.getComputedStyle(element).fontSize
			originalFontSize[element.tagName] = currentFontSize
		})
	}

	storeOriginalFontSizes()

	// Funkcja ustawiająca rozmiar czcionki
	function setFontSize(clickCount) {
		const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a, .btn-more')

		textElements.forEach(element => {
			if (element.closest('nav')) return // Ignorowanie menu w tym przypadku

			const currentFontSize = window.getComputedStyle(element).fontSize
			const currentSize = parseFloat(currentFontSize)
			let newFontSize

			if (clickCount === 1) {
				newFontSize = currentSize * 1.1 // Zwiększenie o 10%
			} else if (clickCount === 2) {
				newFontSize = currentSize * 1.2 // Zwiększenie o 20%
			} else {
				newFontSize = parseFloat(originalFontSize[element.tagName]) // Przywrócenie oryginalnego rozmiaru
			}

			element.style.fontSize = newFontSize + 'px'
		})
	}

	// Obsługuje kliknięcie na przycisk zwiększania czcionki
	increaseBtn.addEventListener('click', () => {
		clickCount = (clickCount + 1) % 3 // Resetuje licznik po trzech kliknięciach
		setFontSize(clickCount)
	})

	// Obsługuje kliknięcie przycisku wyszukiwania
	searchButton.addEventListener('click', searchResultsHandler)

	searchField.addEventListener('keydown', e => {
		if (e.key === 'Enter') {
			e.preventDefault()
			if (searchResults.length > 0) {
				nextResult() // Przejdź do następnego wyniku, jeśli są już wyniki
			} else {
				searchResultsHandler() // Inicjuj wyszukiwanie, jeśli jeszcze nie ma wyników
			}
		}
	})

	// Funkcja obsługująca wyszukiwanie
	function searchResultsHandler() {
		query = searchField.value.toLowerCase().trim()
		console.log('Searching for:', query)

		// Usuń poprzednie podświetlenia
		removeHighlights()

		searchField.value = ''
		if (query === '') {
			searchResults = []
			currentIndex = 0
			return
		}

		// Wyszukiwanie elementów zawierających zapytanie
		searchResults = Array.from(document.querySelectorAll('h2, h3, p, li, a, .btn-more')).filter(element => {
			return element.textContent.toLowerCase().includes(query)
		})

		console.log('Search results found:', searchResults)

		currentIndex = 0

		if (searchResults.length > 0) {
			highlightSearchResult()
		}
	}

	// Funkcja do podświetlania wyniku wyszukiwania
	function highlightSearchResult() {
		removeHighlights()

		if (searchResults[currentIndex]) {
			const element = searchResults[currentIndex]
			highlightWord(element, query)
			element.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	}

	// Funkcja do usuwania wszystkich podświetleń
	function removeHighlights() {
		document.querySelectorAll('.highlight').forEach(element => {
			element.classList.remove('highlight')
		})
		document.querySelectorAll('mark').forEach(mark => {
			const parent = mark.parentNode
			parent.replaceChild(document.createTextNode(mark.textContent), mark)
			parent.normalize()
		})
	}

	// Funkcja do podświetlania szukanego słowa w danym elemencie
	function highlightWord(element, word) {
		const innerHTML = element.innerHTML
		const regex = new RegExp(`(${word})`, 'gi')
		const newHTML = innerHTML.replace(regex, '<mark>$1</mark>')
		element.innerHTML = newHTML
	}

	// Funkcja do przejścia do następnego wyniku
	function nextResult() {
		if (searchResults.length === 0) return
		currentIndex = (currentIndex + 1) % searchResults.length
		highlightSearchResult()
	}

	// Funkcja do przejścia do poprzedniego wyniku
	function prevResult() {
		if (searchResults.length === 0) return
		currentIndex = (currentIndex - 1 + searchResults.length) % searchResults.length
		highlightSearchResult()
	}

	// Obsługuje klawisze strzałek do nawigacji między wynikami
	window.addEventListener('keydown', e => {
		if (e.key === 'ArrowRight') {
			nextResult()
		} else if (e.key === 'ArrowLeft') {
			prevResult()
		}
	})

	// Obsługuje kliknięcie przycisków do rozwijania/zwijania treści
	buttons.forEach(button => {
		button.addEventListener('click', function () {
			const parent = this.closest('.describe') // Znajdź najbliższą sekcję opisującą
			const longText = parent.querySelector('.long-text') // Pobierz tekst do rozwinięcia
			const shortText = parent.querySelector('.short-text') // Pobierz krótki tekst

			// Przełącz widoczność tekstów
			if (longText.style.display === 'none' || longText.style.display === '') {
				longText.style.display = 'block' // Pokaż długi tekst
				this.textContent = 'Kliknij, aby ukryć' // Zmieniaj tekst przycisku
			} else {
				longText.style.display = 'none' // Ukryj długi tekst
				this.textContent = 'Kliknij aby przeczytać więcej...' // Zresetuj tekst przycisku
			}
		})
	})

	// Inicjalizacja Masonry po załadowaniu strony
	const masonry = new Macy({
		container: '.gallery-box',
		mobileFirst: true,
		loop: true,
		columns: 1,
		breakAt: {
			400: 2,
			520: 3,
			940: 4,
			1200: 5,
		},
		margin: {
			x: 2,
			y: 2,
		},
	})

	// Pokazywanie przycisku po przewinięciu
	window.onscroll = function () {
		const btn = document.getElementById('backToTopBtn')
		if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
			btn.style.display = 'block'
		} else {
			btn.style.display = 'none'
		}
	}

	// Funkcja przewijania do góry
	document.getElementById('backToTopBtn').addEventListener('click', function () {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	})

	// Aktualizacja roku w stopce
	document.getElementById('footerYear').textContent = new Date().getFullYear()
})

document.querySelector('.contrast').addEventListener('click', function () {
	const achieveSection = document.querySelector('.achieve')

	// Przełączanie tła w sekcji .achieve
	if (achieveSection) {
		achieveSection.style.backgroundImage = achieveSection.style.backgroundImage ? '' : 'none'
	}

	// Przełączanie klasy high-contrast na body
	document.body.classList.toggle('high-contrast')
})

// Obsługuje rozwijanie opcji dostępności
document.getElementById('accessibilityButton').addEventListener('click', function () {
	const options = document.getElementById('accessibilityOptions')
	// Toggle visibility of accessibility options
	options.style.display = options.style.display === 'flex' ? 'none' : 'flex'
})
