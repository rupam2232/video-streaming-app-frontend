import { useState, useEffect } from 'react'
import axios from '../utils/axiosInstance.js'
import { timeAgo } from '../utils/timeAgo.js'
import { videoDuration } from '../utils/videoDuration.js'
import formatNumbers from '../utils/formatNumber.js'
import joinedAt from '../utils/joinedAt.js'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import { AccountHover } from '../components/index.js'
import { useNavigate, NavLink, useSearchParams } from 'react-router-dom'
import { VideoNotFound } from '../components/index.js'
import { AvatarImage, Avatar } from '@/components/ui/avatar.jsx'
import toast from "react-hot-toast"


const Home = () => {
    const [videos, setVideos] = useState([])
    const [loader, setLoader] = useState(true)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const channel = searchParams.get("channel");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const sortType = searchParams.get("sortType");

    useEffect(() => {
        axios.get(`/videos/`)
            .then((value) => setVideos(value.data.data.videos))
            .catch((error) => console.error(error))
            .finally(() => setLoader(false))

    }, [])

    const toggleSubscribe = (ownerId) => {
        axios.post(`/subscription/c/${ownerId}`)
            .then((value) => {
                if (value.data.message.toLowerCase() === "subscribed") {
                    let videoData = [...videos]
                    let updatedVideo = videoData.map((video) => {
                        if (video.owner._id === ownerId) {
                            video.isSubscribed = true
                        }
                        return video
                    })
                    setVideos(updatedVideo)

                    axios.get(`/subscription/u/${ownerId}`)
                        .then((value) => {
                            videoData = [...videos]
                            updatedVideo = videoData.map((video) => {
                                if (video.owner._id === ownerId) {
                                    video.owner.subscribers = value.data.data.subscribers.length
                                }
                                return video
                            })
                            setVideos(updatedVideo)
                        })
                        .catch((error) => {
                            console.error(error.message);
                        });
                } else if (value.data.message.toLowerCase() === "unsubscribed") {
                    let videoData = [...videos]
                    let updatedVideo = videoData.map((video) => {
                        if (video.owner._id === ownerId) {
                            video.isSubscribed = false
                        }
                        return video
                    })
                    setVideos(updatedVideo)

                    axios.get(`/subscription/u/${ownerId}`)
                        .then((value) => {
                            videoData = [...videos]
                            updatedVideo = videoData.map((video) => {
                                if (video.owner._id === ownerId) {
                                    video.owner.subscribers = value.data.data.subscribers.length
                                }
                                return video
                            })
                            setVideos(updatedVideo)
                        })
                        .catch((error) => {
                            console.error(error.message);
                        });
                }
            })
            .catch((error) => {
                if (error.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    navigate("/login")
                }
                console.error(errorMessage(error));
            })
    }

    if (loader === true) {
        return (
            <section className='w-full h-full pb-[70px] sm:pb-0 flex justify-center items-center'>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] auto-rows-min gap-x-4 gap-y-8 ">

                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-3" >
                            <div className="aspect-video rounded-xl animate-pulse bg-muted/90" >
                            </div>
                            <div className="flex gap-x-2">
                                <div className="w-12 h-10 rounded-full animate-pulse bg-muted/90">
                                </div>
                                <div className="w-full h-16">
                                    <div className='w-full h-1/3 rounded-xl animate-pulse bg-muted/90'></div>
                                    <div className='w-2/3 h-1/3 mt-2 rounded-xl animate-pulse bg-muted/90'></div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/90" />
                </div>
            </section>)
    }

    if (videos.length === 0) {
        return (
            <VideoNotFound />
        )
    }


    return (
        <section className="w-full">
            <div className='grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-x-4 gap-y-8 p-4'>

                {videos ? videos.map((video) => (
                    <div key={video._id} className="aspect-video rounded-xl">
                        <div className='relative mb-2 w-full pt-[56%]' aria-label='Thubmnail'>
                            <NavLink to={`/video/${video._id}`}>
                                <div className="absolute inset-0">
                                    <img src={video.thumbnail} alt={`${video.title} uploaded by @${video.owner.username}`} className='w-full h-full object-cover rounded-md' />
                                </div>
                                <span className="absolute bottom-1 right-1 inline-block rounded bg-black/100 text-white px-1.5 text-sm">{videoDuration(video.duration)}</span>
                            </NavLink>
                        </div>
                        <div className="flex gap-x-2 cursor-pointer">
                           
                            <AccountHover user={{ ...video.owner, isSubscribed: video.isSubscribed }} toggleSubscribe={toggleSubscribe}>
                                <div onClick={() => navigate(`/@${video.owner.username}`)} className="cursor-pointer">
                                    <Avatar className='h-10 w-10 shrink-0'>
                                        <AvatarImage src={setAvatar(video.owner.avatar)} alt={`@${video.owner.username}`} className="object-cover" />
                                    </Avatar>
                                </div>
                            </AccountHover>

                            <div className="w-full">
                                <NavLink to={`/video/${video._id}`} >
                                    <h6 className="mb-1 font-semibold max-h-16 line-clamp-2 text-lg whitespace-normal" title={video.title}>{video.title}</h6>
                                    <p className="flex text-sm text-secondary-foreground" title={`${formatNumbers(video.views)} views | uploaded ${timeAgo(video.createdAt)}`}>
                                        <span>{formatNumbers(video.views)} views </span>
                                        <span className=" before:content-['•'] before:px-2">{timeAgo(video.createdAt)}</span>
                                    </p>
                                </NavLink>
                                
                                <AccountHover user={{ ...video.owner, isSubscribed: video.isSubscribed }} toggleSubscribe={toggleSubscribe}>
                                    <span onClick={() => navigate(`/@${video.owner.username}`)} className='text-sm cursor-pointer text-secondary-foreground/70'>{`@${video.owner.username}`}</span>
                                </AccountHover>

                            </div>
                        </div>
                    </div>
                )) : <h1>Some thing went wrong please refresh the page or else contact to the support</h1>}
            </div>
        </section>
    )
}

export default Home
