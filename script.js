document.addEventListener('DOMContentLoaded', () => {
	const burgerBtn = document.getElementById('burger-btn')
	const closeBtn = document.getElementById('close-btn')
	const navMenu = document.getElementById('nav-menu')
	const increaseBtn = document.querySelector('.increase')
	const searchField = document.querySelector('.search-field')
	const searchButton = document.querySelector('.search')
	const buttons = document.querySelectorAll('.btn-more')

	let clickCount = 0
	let originalFontSize = {}
	let currentIndex = 0
	let searchResults = []
	let query = ''
	// Funkcja otwierająca menu
	const openMenu = () => {
		navMenu.classList.add('active')
		burgerBtn.setAttribute('aria-expanded', 'true')
	}
	// Funkcja zamykająca menu
	const closeMenu = () => {
		navMenu.classList.remove('active')
		burgerBtn.setAttribute('aria-expanded', 'false')
	}
	// Obsługa kliknięcia myszą
	burgerBtn.addEventListener('click', openMenu)
	closeBtn.addEventListener('click', closeMenu)
	// Obsługa klawiatury (Enter i Spacja)
	burgerBtn.addEventListener('keydown', event => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			openMenu()
		}
	})
	// Zamykanie menu mobilnego po kliknięciu w link
	document.querySelectorAll('#nav-menu a').forEach(link => {
		link.addEventListener('click', closeMenu)
		closeBtn.addEventListener('keydown', event => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault()
				closeMenu()
			}
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

		// Funkcja obsługująca kliknięcie lub naciśnięcie Enter na przycisku wyszukiwania
		function handleSearch() {
			if (searchResults.length > 0) {
				nextResult() // Przejdź do następnego wyniku, jeśli są już wyniki
			} else {
				searchResultsHandler() // Inicjuj wyszukiwanie, jeśli jeszcze nie ma wyników
			}
		}

		// Obsługuje kliknięcie przycisku wyszukiwania
		searchButton.addEventListener('click', handleSearch)

		// Obsługuje naciśnięcie klawisza Enter w polu wyszukiwania
		searchField.addEventListener('keydown', e => {
			if (e.key === 'Enter') {
				e.preventDefault() // Zapobiegaj domyślnemu zachowaniu
				handleSearch() // Wywołaj funkcję wyszukiwania
			}
		})

		// Funkcja obsługująca wyszukiwanie
		function searchResultsHandler() {
			query = searchField.value.toLowerCase().trim()
			console.log('Searching for:', query)

			// Usuń poprzednie podświetlenia
			removeHighlights()

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
			} else if (e.key === 'Escape') {
				clearSearchResults()
			}
		})

		function clearSearchResults() {
			// Wyczyść wyniki wyszukiwania
			searchResults = []
			currentIndex = 0

			// Usuń podświetlenia
			removeHighlights()

			// Zresetuj pole wyszukiwania
		}
		// Obsługuga kliknięcia przycisków do rozwijania i zwijania tekstu
		buttons.forEach(button => {
			button.addEventListener('click', function () {
				const parent = this.closest('.describe')
				const longText = parent.querySelector('.long-text')

				if (longText.style.display === 'none' || longText.style.display === '') {
					longText.style.display = 'block'
					this.textContent = 'Kliknij, aby ukryć'
				} else {
					longText.style.display = 'none' //
					this.textContent = 'Kliknij aby przeczytać więcej...'
				}
			})
		})

		// Inicjalizacja Masonry po załadowaniu strony
		const masonry = new Macy({
			container: '.gallery-box',
			mobileFirst: true,
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
		if (options.style.display === 'flex') {
			options.style.display = 'none'
		} else {
			options.style.display = 'flex'
		}
	})
	// Przełączanie klasy gray ba body
	document.querySelector('.gray-color').addEventListener('click', function () {
		document.body.classList.toggle('gray')
	})
	// Funkcja do zamknięcia alertu
	function closeAlert() {
		document.getElementById('alert').style.display = 'none'
	}

	// Nasłuchiwanie na kliknięcie przycisku "OK" w alercie
	document.getElementById('closeAlert').addEventListener('click', closeAlert)

	// Sprawdzenie, czy w URL jest parametr 'status' i wyświetlenie alertu
	window.onload = function () {
		const urlParams = new URLSearchParams(window.location.search)
		const status = urlParams.get('status') // Sprawdzamy parametr 'status'

		if (status === 'success') {
			document.getElementById('alertMessage').textContent = 'Wiadomość została pomyślnie wysłana!'
			document.getElementById('alert').classList.add('success')
			document.getElementById('alert').style.display = 'block'
		} else if (status === 'error') {
			document.getElementById('alertMessage').textContent = 'Wszystkie pola muszą być wypełnione!'
			document.getElementById('alert').classList.add('error')
			document.getElementById('alert').style.display = 'block'
		}
	}
})
