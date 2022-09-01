import { SetStateAction, useEffect } from 'react'
import { useStore } from './weather-history-store'
import { DateTime } from 'luxon'
import { Year, Years, YearsState } from './interfaces'
import axios, { AxiosError, AxiosResponse } from 'axios'


export default function APICalls(
        address: string, 
        yearsAgoStart: number,
        oldYearAgoStart: number,
        numberOfPastYears: number, 
        startMMDD: string, 
        endMMDD: string, 
        addYear: any, 
        addOldYear: any,
        setApiError: any,
        weatherParameter: string
    ): void  {

    const currentYear = DateTime.now().year
    const apiUrls: string[] = []
    const apiOldUrls: string[] = []


    // RECENT YEARS
    for (let index=yearsAgoStart; index<(numberOfPastYears + yearsAgoStart); index++) {
        const year: number = currentYear - index - 1
        const startYYYYMMDD: string = `${year}-${startMMDD}`
        const endYYYYMMDD: string = `${year}-${endMMDD}`
        // --- expect a bug here where startDate is between Dec 16 & Dec 31, as year overlap
console.log(address)
const apiUrl: string = `http://localhost:8080/history?year=${year}&address=${address}&startDate=${startYYYYMMDD}&endDate=${endYYYYMMDD}`
console.log(address)
        apiUrls.push(apiUrl)
    }

    // OLDER YEARS
    for (let index=oldYearAgoStart; index<(numberOfPastYears + oldYearAgoStart); index++) {
        const year: number = currentYear - index - 1
        const startYYYYMMDD: string = `${year}-${startMMDD}`
        const endYYYYMMDD: string = `${year}-${endMMDD}`
        const apiUrl = `http://localhost:8080/history?year=${year}&address=${address}&startDate=${startYYYYMMDD}&endDate=${endYYYYMMDD}`
        apiOldUrls.push(apiUrl)
    }

    function callAPI() {
        apiUrls.forEach((url) => {
    console.log(`--- new url REQUESTED ---->> : ${url}`)
            axios.get((url))
                .then((response: AxiosResponse) => {
                    const { data } = response
    console.log(`--- new url RESPONDED <<---- : ${url}`)
                    if (data.name !== 'Error') {
                        addYear(
                            Number(getYearFromData(data)),
                            getTemperaturesFromData(data)
                        )
                    } else {
                        handleError(data)
                    }
                })
                .catch(handleError)
        })

        apiOldUrls.forEach((url) => {
    console.log(`--- old url REQUESTED ---->> : ${url}`)
            axios.get((url))
                .then((response: AxiosResponse) => {
                    const { data } = response
    console.log(`--- old url RESPONDED <<---- : ${url}`)
                    if (data.name !== 'Error') {
                        addOldYear(
                            Number(getYearFromData(data)),
                            getTemperaturesFromData(data)
                        )
                    } else {
                        handleError(data)
                    }
                })
                .catch(handleError)
        })
    }

    function getYearFromData(data: any) {
        const year = Number(data.days[0].datetime.substring(0,4))
        return year
    }

    function getTemperaturesFromData(data: any) {
        const temperatues = data.days.map((day: any) => day[weatherParameter])
        return temperatues
    }

    callAPI()

    function handleError(error: AxiosError) {
        console.log(error.message)
        setApiError(true)
/*

NEXT : pass up apiError = true

*/
    }
}
