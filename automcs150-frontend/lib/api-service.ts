// This is a mock implementation of an API service
// In a real application, this would make actual API calls to retrieve carrier data

export interface CarrierData {
  legalName: string
  dba: string
  physicalAddress: {
    street: string
    city: string
    state: string
    zip: string
  }
  mailingAddress: {
    sameAsPhysical: boolean
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  phoneNumber: string
  ein: string
  dunsNumber: string
  operationClassification: string[]
  cargoType: string[]
  vehicles: {
    owned: number
    termLeased: number
    tripLeased: number
  }
  drivers: {
    total: number
    cdl: number
  }
}

export async function fetchCarrierDataByUSDOT(usdotNumber: string): Promise<CarrierData | null> {
  // In a real application, this would make an API call to retrieve carrier data
  // For demo purposes, we'll return mock data based on the USDOT number

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock data for demonstration
  const mockCarrierData: CarrierData = {
    legalName: `Carrier ${usdotNumber} Inc.`,
    dba: `Carrier ${usdotNumber}`,
    physicalAddress: {
      street: "123 Main Street",
      city: "Anytown",
      state: "CA",
      zip: "90210",
    },
    mailingAddress: {
      sameAsPhysical: true,
    },
    phoneNumber: "(555) 123-4567",
    ein: "12-3456789",
    dunsNumber: "123456789",
    operationClassification: ["A", "B"],
    cargoType: ["A", "B", "C"],
    vehicles: {
      owned: 5,
      termLeased: 2,
      tripLeased: 0,
    },
    drivers: {
      total: 7,
      cdl: 5,
    },
  }

  return mockCarrierData
}

export async function validateUSDOT(usdotNumber: string): Promise<boolean> {
  // In a real application, this would validate the USDOT number with an API
  // For demo purposes, we'll just simulate validation

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Simple validation: USDOT number should be numeric and between 5-8 digits
  const isValid = /^\d{5,8}$/.test(usdotNumber)

  return isValid
}

