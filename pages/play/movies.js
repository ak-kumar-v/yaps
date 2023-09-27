import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router';
import Head from 'next/head'
import useSWR from "swr";
import FilmGenres from '../../components/FilmGenres'
import FilmHeading from '../../components/FilmHeading'
import FilmImage from '../../components/FilmImage'
import FilmInfo from '../../components/FilmInfo'
import FilmRating from '../../components/FilmRating'
import FilmSynopsis from '../../components/FilmSynopsis'
import {renderLanguage, renderLength, renderRating, renderStatus, renderYear} from "../movie/[id]";
import {AiOutlineExpand} from "react-icons/ai";
import {BsFillLightbulbFill} from "react-icons/bs";
import {BiCollapse} from "react-icons/bi";

const servers_ = [{
    servername: "Vidsrc.me", link: "https://vidsrc.me/embed/movie?",
}, {
    servername: "Vidsrc.to", link: "https://vidsrc.to/embed/movie/"
}, {
    servername: "Moviesapi.club", link: "https://moviesapi.club/movie/"
}, {
    servername: "Blackvid", link: "https://blackvid.space/embed?tmdb="
}]
const fetcher = (...args) => fetch(...args).then((res) => res.json())

const Movies = () => {
    const router = useRouter()
    const {id, tmdb} = router.query;
    const me = tmdb ? `tmdb=${tmdb}` : `imdb=${id}`
    const to = tmdb ? `${tmdb}` : `${id}`
    const [lightStatus, switchLight] = useState(false)
    const [videoServer, setVideoServer] = useState('')
    const {data} = useSWR(`/api/movie/${id}`, fetcher)
    const [MovieDetailsHidden, setMovieDetailsHidden] = useState(true)
    useEffect(() => {
        if (localStorage.getItem("userWatched")) {
            let data = JSON.parse(localStorage.getItem("userWatched"))
            let moviePresent = false
            for (let i in data.movies) {
                if (id) if (data.movies[i] === id) {
                    moviePresent = true
                } else {
                    if (data.movies === tmdb) {
                        moviePresent = true
                    }
                }
            }
            if (id || tmdb) {
                if (!moviePresent) {
                    if (id)
                        data.movies.push(id)
                    else data.movies.push(tmdb)
                    localStorage.setItem("userWatched", JSON.stringify(data))
                }
            }
        } else {
            if (id || tmdb)
                localStorage.setItem("userWatched", JSON.stringify({
                    movies: [id ? id : tmdb], tv: []
                }))
        }
    }, [id, tmdb]);
    return (<>
        <Head>
            <title>Play Movies | Yaps</title>
        </Head>
        <div
            className={` top-0 left-0 z-[997] bg-black transition duration-300 ease-in-out ${lightStatus ? 'opacity-1 fixed w-full h-screen ' : 'opacity-0 h-0 w-0'}`}>
        </div>
        <div
            className={`${MovieDetailsHidden ? 'lg:grid-row-1 lg:grid-cols-2' : 'lg:grid-row-2 lg:grid-cols-1'} grid w-full  ${lightStatus ? '' : 'h-full'} z-[999] grid-cols-1 grid-rows-2`}>
            <div className={` ${MovieDetailsHidden ? 'w-full' : 'min-w-2/3 '} flex flex-col  h-full`}>
                <iframe src={videoServer ? videoServer : servers_[0].link + me}
                        className={`z-[998] ${lightStatus ? 'absolute left-0 lg:left-[20%] h-[80vh] lg:w-2/3 w-full ' : MovieDetailsHidden ? 'w-full h-[60vh]' : 'w-full h-[95vh]'}`}
                        allowFullScreen="allowfullscreen"></iframe>
                <div
                    className={`${lightStatus ? 'w-1/2 absolute ' : 'w-full '} p-4 pl-0 bg-transparent gap-10 z-[999] flex flex-row justify-start  top-[100%] lg:top-[90%] items-center `}>
                    <div onClick={() => setMovieDetailsHidden(!MovieDetailsHidden)}
                         className={`${lightStatus ? 'hidden' : 'flex'} flex-row gap-1 items-center hover:text-orange-500 transition duration-300 ease-in-out hover:cursor-pointer`}>
                        {MovieDetailsHidden ?
                            <AiOutlineExpand/>:<BiCollapse/>  }
                        <span>{MovieDetailsHidden ? 'Expand' : 'Collapse'}</span>
                    </div>
                    <div onClick={() => switchLight(!lightStatus)}
                         className={"flex flex-row gap-1 items-center hover:text-orange-500 transition duration-300 ease-in-out hover:cursor-pointer"}>
                        <BsFillLightbulbFill/>
                        <span>{MovieDetailsHidden ? 'Light' : 'Light'}</span>
                    </div>
                </div>
                <div className={`${lightStatus ? 'hidden' : 'flex'}  w-full flex justify-start  items-center h-36`}>
                    <div className={"rounded w-full h-full flex flex-row "}>
                        <div
                            className={"p-2 h-full bg-app-shady-white dark:bg-app-grey dark:text-black text-center w-1/3"}>
                            {`You are watching `}
                            <div className={" font-bold"}>{data ? data.imdb.imdb.name : ""}</div>
                            <div> If current server doesn't work please try other servers beside.</div>
                        </div>
                        <div className={" bg-app-pure-white text-black  w-2/3 h-full"}>
                            <div
                                className={"w-full flex flex-wrap flex-row gap-7 p-5 justify-start items-center h-10"}>
                                {servers_.map((server, index) => {
                                    return (<div
                                        onClick={() => {
                                            if (server.servername === "Vidsrc.me") setVideoServer(server.link + me)
                                            else if (server.servername === "Vidsrc.to") setVideoServer(server.link + to)
                                            else setVideoServer(server.link + data?.imdb.imdb.tmdb_id);
                                        }}
                                        className={"dark:bg-app-semi-dark-blue dark:text-white hover:scale-110 hover:cursor-pointer transition duration-300 ease-in-out bg-app-shady-white rounded p-3 w-max text-center h-8"}
                                        key={index}>
                                        {server.servername}
                                    </div>)
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={` ${MovieDetailsHidden ? '' : 'hidden'} ${lightStatus ? 'hidden' : 'flex'} min-w-1/3 h-full`}>
                <section
                    className='flex flex-row ml-10 lg:mt-0 mt-10 lg:flex-col lg:justify-end justify-center items-center lg:items-baseline'>
                    <FilmImage
                        src={data?.detail?.poster_path}
                        title={data?.detail?.title}
                    />
                    <section>
                        <FilmHeading
                            from={'movie'}
                            tagline={data?.detail?.tagline}
                            title={data?.detail?.title}
                        />
                        <FilmRating number={renderRating(data?.detail?.vote_average)}/>
                        <FilmSynopsis synopsis={data?.detail?.overview}/>
                        <FilmInfo
                            media_type={data?.imdb.imdb.content_type.toLowerCase()}
                            language={renderLanguage(data?.detail?.spoken_languages || [])}
                            length={renderLength(data?.detail?.runtime)}
                            status={renderStatus(data?.detail?.status)}
                            year={renderYear(data?.detail?.release_date)}
                        />
                        <FilmGenres genres={data?.detail?.genres || []}/>
                    </section>
                </section>
            </div>
        </div>
    </>)
}
export default Movies;
