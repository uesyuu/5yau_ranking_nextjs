import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {Box} from "@mui/system";
import axios, {AxiosResponse} from "axios";
import {useEffect, useState} from "react";
import moment from "moment";

const Home: NextPage = () => {
    const persons = [
        "2008UENO01", "2009OLSO01", "2011HOFF02", "2011RHEI01", "2012ITOR01",
        "2013FERT01", "2013GALA04", "2013KOBA01", "2015FIRM01", "2015GOWT01",
        "2015KUCA01", "2015MATT05", "2015MOHA10", "2015ROBI04", "2015TAKA05",
        "2016MORA24", "2016YENC01", "2017HONG17", "2017PALI04", "2017SZYS01",
        "2018PIKE01", "2018VASY01", "2009LIUE01", "2009YAUR01", "2007VALK01",
        "2010HULL01", "2010UTOM01", "2010WUIF01", "2012BEAH01", "2012GONZ10",
        "2012MCNE01", "2013WANG67", "2014CZAP01", "2014LEES01", "2014RAJE03",
        "2014VORL01", "2014WENW01", "2014YELI01", "2014ZAKR01", "2015CHNG01",
        "2015GROH02", "2015KOVA07", "2015OAKK01", "2015RAOJ01", "2015SING22",
        "2015STAU01", "2015WANG09", "2016KOLA02", "2016MART29", "2016MELN01",
        "2016NUNE11", "2017HUAN77", "2017KIRB01", "2015LEEJ12", "2015LEON02",
        "2018BERE01", "2017TRAN25", "2015MINK04", "2015CHER07", "2013RIGO01",
        "2018MURR03", "2017ENGB01", "2018NGHA02"
    ]
    const URL = "https://www.worldcubeassociation.org/api/v0/persons?per_page=100&wca_ids="

    const [personsData, setPersonsData] = useState(Array<PersonsData>())

    interface PersonsData {
        name: string,
        single: number,
        average: number
    }

    enum SortType {
        SINGLE,
        AVERAGE
    }

    useEffect(() => {
        fetchPersonsData()
    }, [])

    const fetchPersonsData = () => {
        axios
            .get(URL + persons.join(","))
            .then((response: AxiosResponse<Array<any>>) => {
                const data: Array<PersonsData> = response.data.map((item: any) => ({
                    name: item.person.name as string,
                    single: item.personal_records["555"].single.best as number,
                    average: item.personal_records["555"].average.best as number
                }))
                setPersonsData(getSortedResult(data, SortType.AVERAGE))
                console.log(getSortedResult(data, SortType.AVERAGE))
            })
    }

    const getSortedResult = (data: Array<PersonsData>, sortType: SortType): Array<PersonsData> => {
        const dataTmp = data.slice()
        switch (sortType) {
            case SortType.SINGLE: {
                dataTmp.sort((a: PersonsData, b: PersonsData) => a.single - b.single)
                break
            }
            case SortType.AVERAGE: {
                dataTmp.sort((a: PersonsData, b: PersonsData) => a.average - b.average)
                break
            }
            default: {
                break
            }
        }
        return dataTmp
    }

    const handleSingleSortClick = () => {
        setPersonsData(getSortedResult(personsData, SortType.SINGLE))
    }

    const handleAverageSortClick = () => {
        setPersonsData(getSortedResult(personsData, SortType.AVERAGE))
    }

    const getFormattedTime = (milliSec: number): string => {
        if (milliSec > 60000) {
            return moment(milliSec).format("m:ss.SS")
        } else {
            return moment(milliSec).format("ss.SS")
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>5x5 Yau Ranking</title>
                <meta name="description" content="5x5 Yau Ranking"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Box
                display={"flex"}
                justifyContent={"center"}
                flexDirection={"column"}
                sx={{
                    margin: '0 auto',
                    maxWidth: '700px'
                }}
            >
                <Box
                    display={"flex"}
                    justifyContent={"center"}
                    sx={{
                        padding: "20px"
                    }}
                >
                    <Typography variant={"h3"}>5x5 Yau Ranking</Typography>
                </Box>
                <Box display={"flex"} justifyContent={"center"}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell align={"center"}>
                                        <Button variant={"contained"} onClick={handleSingleSortClick}>
                                            Sort
                                        </Button>
                                    </TableCell>
                                    <TableCell align={"center"}>
                                        <Button variant={"contained"} onClick={handleAverageSortClick}>
                                            Sort
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align={"center"}>Rank</TableCell>
                                    <TableCell align={"center"}>Name</TableCell>
                                    <TableCell align={"center"}>Single</TableCell>
                                    <TableCell align={"center"}>Average</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {personsData.map((item, index) =>
                                    <TableRow key={index}>
                                        <TableCell align={"center"}>{index + 1}</TableCell>
                                        <TableCell align={"center"}>{item.name}</TableCell>
                                        <TableCell align={"center"}>{getFormattedTime(item.single * 10)}</TableCell>
                                        <TableCell align={"center"}>{getFormattedTime(item.average * 10)}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </div>
    )
}

export default Home
