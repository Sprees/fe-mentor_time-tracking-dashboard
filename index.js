const filterBtns = document.querySelectorAll('button[data-timeframe]')

// Default active button | allows change in HTML only
let timeframe = Array.from(filterBtns).find((btn) =>
    btn.classList.contains('active'),
).dataset.timeframe

filterBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        timeframe = e.target.dataset.timeframe
        fetchTimeData()
        filterBtns.forEach((b) => b.classList.remove('active'))
        e.target.classList.add('active')
    })
})

async function fetchTimeData() {
    try {
        const requestURL = './data.json'
        const request = new Request(requestURL)
        const response = await fetch(request)

        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }

        const cardsData = await response.json()
        populateCards(cardsData, timeframe)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

function populateCards(cardsData, timeframe) {
    const dashboard = document.querySelector('.dashboard')

    const previousText = {
        daily: 'Yesterday',
        weekly: 'Last Week',
        monthly: 'Last Month',
    }

    let existingCards = dashboard.querySelectorAll('.card--time')

    if (existingCards.length <= 1) {
        for (const cardData of cardsData) {
            const current = cardData.timeframes[timeframe].current
            const previous = cardData.timeframes[timeframe].previous

            // Create elements
            const card = document.createElement('section')
            const cardTime = document.createElement('div')
            const titleWrapper = document.createElement('div')
            const contentWrapper = document.createElement('div')
            const titleH2 = document.createElement('h2')
            const ellipsisBtn = document.createElement('button')
            const ellipsis = document.createElement('img')
            const contentP1 = document.createElement('p')
            const contentP2 = document.createElement('p')

            // Add classes to created elements
            card.classList.add(
                'card',
                'card--top-bg',
                replaceSpaceLowercase(cardData.title),
            )
            cardTime.classList.add('card', 'card--time')
            titleWrapper.classList.add('card--time__title-wrapper')
            ellipsisBtn.classList.add('btn')
            contentWrapper.classList.add('card--time__content-wrapper')
            contentWrapper.dataset.timeframe = timeframe
            contentP1.classList.add('text-lg')
            contentP2.classList.add('accent-text-sm')

            // Add content to created elements
            ellipsis.src = './assets/images/icon-ellipsis.svg'
            titleH2.innerText = cardData.title
            contentP1.innerText = `${current}${
                current <= 1 ? 'hr' : 'hrs'
            }`
            contentP2.innerText = `${previousText[timeframe]} - ${previous}${ 
                previous <= 1 ? 'hr' : 'hrs'
             }`

            // Append elements
            ellipsisBtn.append(ellipsis)
            titleWrapper.append(titleH2, ellipsisBtn)
            contentWrapper.append(contentP1, contentP2)
            cardTime.append(titleWrapper, contentWrapper)
            card.append(cardTime)

            dashboard.append(card)
        }
    } else {
        existingCards = Array.from(existingCards)
        cardsData.forEach((cardData, i) => {
                const current = cardData.timeframes[timeframe].current
                const previous = cardData.timeframes[timeframe].previous

                const contentWrapper = existingCards[i].querySelector('[data-timeframe]')
                const contentP1 = contentWrapper.children[0]
                const contentP2 = contentWrapper.children[1]
    
                contentWrapper.dataset.timeframe = timeframe
                contentP1.innerText = `${current}${current <= 1 ? 'hr' : 'hrs'}`
                contentP2.innerText = `${previousText[timeframe]} - ${previous}${previous <= 1 ? 'hr' : 'hrs'}`
        })
    }
}

function replaceSpaceLowercase(text) {
    return text.toLowerCase().replace(/\s/g, '-')
}

fetchTimeData()
