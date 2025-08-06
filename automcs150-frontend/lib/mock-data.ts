// Types for our mock data
export interface PdfGenerationRecord {
    id: string
    usdot: string
    user: string
    timestamp: string
    day: string
    month: string
    year: string
}

// Function to generate random USDOT numbers
const generateRandomUsdot = () => {
    const usdotNumbers = ["12345", "54321", "67890", "98765", "24680", "13579", "11223", "44556"]
    return usdotNumbers[Math.floor(Math.random() * usdotNumbers.length)]
}

// Function to generate random users
const generateRandomUser = () => {
    const users = ["John", "Sarah", "Michael", "Emily", "David", "Jessica", "Robert", "Amanda", "Fabio", "Craig"]
    return users[Math.floor(Math.random() * users.length)]
}

// Function to generate a random date within the last 3 years
const generateRandomDate = () => {
    const now = new Date()
    const threeYearsAgo = new Date()
    threeYearsAgo.setFullYear(now.getFullYear() - 3)

    const randomTimestamp = new Date(threeYearsAgo.getTime() + Math.random() * (now.getTime() - threeYearsAgo.getTime()))

    return randomTimestamp
}

// Function to format date as day of month (1-31)
const formatDay = (date: Date) => {
    return date.getDate().toString()
}

// Function to format date as month (Jan-Dec)
const formatMonth = (date: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months[date.getMonth()]
}

// Function to format date as year (e.g., 2022)
const formatYear = (date: Date) => {
    return date.getFullYear().toString()
}

// Generate mock data
export const generateMockData = (): PdfGenerationRecord[] => {
    const records: PdfGenerationRecord[] = []

    // Generate 200 random records
    for (let i = 0; i < 200; i++) {
        const date = generateRandomDate()

        records.push({
            id: `record-${i}`,
            usdot: generateRandomUsdot(),
            user: generateRandomUser(),
            timestamp: date.toISOString(),
            day: formatDay(date),
            month: formatMonth(date),
            year: formatYear(date),
        })
    }

    return records
}
