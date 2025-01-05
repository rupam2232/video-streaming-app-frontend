import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { timeAgo } from '../utils/timeAgo'
import { Like, PlaylistBtn, Tick, Button, CommentOptions, AccountHover } from "../components/index.js"
import { NavLink, useNavigate } from 'react-router-dom'
import formatNumbers from '../utils/formatNumber.js'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'
import setAvatar from '../utils/setAvatar.js'
import joinedAt from '../utils/joinedAt.js'
import toast from "react-hot-toast"
import { BadgeCheck, Calendar, UserRoundCheck, UserRoundPlus, SendHorizonal, Loader, LoaderCircle } from 'lucide-react'
import { AvatarImage, Avatar } from '@/components/ui/avatar.jsx'
import { useDispatch } from 'react-redux'
import { logout } from '../store/authSlice.js'

const Video = () => {
    const [fullDesc, setFullDesc] = useState(false)
    const [fetch, setFetch] = useState(1)
    const [video, setVideo] = useState({})
    const [like, setLike] = useState({})
    const [sub, setSub] = useState([])
    const [allComment, setAllComment] = useState({})
    const [postComment, setPostComment] = useState("")
    const [subscribed, setSubscribed] = useState(false)
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState("")
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editingComment, setEditingComment] = useState({})
    const { videoId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const textArea = useRef()

    const toggleSubscribe = (ownerId) => {

        axios.post(`/subscription/c/${ownerId}`)
            .then((value) => {
                if (value.data.message.toLowerCase() === "subscribed") {
                    if (ownerId === video.owner._id) {
                        setSubscribed(true)
                        axios.get(`/subscription/u/${ownerId}`)
                            .then((value) => {
                                setSub(value.data.data.subscribers);
                                let commentData = [...allComment.comments]
                                let updatedComment = commentData.map((coment) => {
                                    if (coment.ownerInfo._id === video.owner._id) {
                                        coment.isSubscribed = true
                                        coment.subscribers = value.data.data.subscribers.length
                                    }
                                    return coment
                                })
                                setAllComment({ ...allComment, comments: updatedComment })
                            })
                            .catch((error) => {
                                console.error(error.message);
                            });
                    } else {
                        setSubscribed(subscribed)
                        let commentData = [...allComment.comments]
                        let updatedComment = commentData.map((coment) => {
                            if (coment.ownerInfo._id === ownerId) {
                                coment.isSubscribed = true
                                coment.subscribers = coment.subscribers + 1
                            }
                            return coment
                        })
                        setAllComment({ ...allComment, comments: updatedComment })
                    }
                } else if (value.data.message.toLowerCase() === "unsubscribed") {
                    if (ownerId === video.owner._id) {
                        setSubscribed(false)
                        axios.get(`/subscription/u/${ownerId}`)
                            .then((value) => {
                                setSub(value.data.data.subscribers);
                                let commentData = [...allComment.comments]
                                let updatedComment = commentData.map((coment) => {
                                    if (coment.ownerInfo._id === video.owner._id) {
                                        coment.isSubscribed = false
                                        coment.subscribers = value.data.data.subscribers.length
                                    }
                                    return coment
                                })
                                setAllComment({ ...allComment, comments: updatedComment })
                            })
                            .catch((error) => {
                                console.error(error.message);
                            });
                    } else {
                        setSubscribed(subscribed)
                        let commentData = [...allComment.comments]
                        let updatedComment = commentData.map((coment) => {
                            if (coment.ownerInfo._id === ownerId) {
                                coment.isSubscribed = false
                                coment.subscribers = coment.subscribers - 1
                            }
                            return coment
                        })
                        setAllComment({ ...allComment, comments: updatedComment })
                    }
                } else {
                    setSubscribed(subscribed)
                    setAllComment(allComment)
                }
            })
            .catch((error) => {
                if (error.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    dispatch(logout())
                    navigate("/login")
                }
                console.error(errorMessage(error));
                setSubscribed(subscribed)
            })
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setPostComment("")
    }

    const handleVideoComment = () => {
        setIsCommentSubmitting(true)
        if (!isEditing) {
            axios.post(`/comment/v/${videoId}`, { content: postComment })
                .then((_) => {
                    setPostComment("")
                    axios.get(`/comment/v/${videoId}`)
                        .then((value) => {
                            setAllComment(value.data.data);
                        })
                        .catch((error) => {
                            console.error(error.message);
                        })
                })
                .catch((error) => {
                    if (error.status === 401) {
                        toast.error("You need to login first", {
                            style: { color: "#ffffff", backgroundColor: "#333333" },
                            position: "top-center"
                        })
                        dispatch(logout())
                        navigate("/login")
                    }
                    console.error(errorMessage(error));
                })
                .finally(() => setIsCommentSubmitting(false))
        } else {
            axios.patch(`/comment/c/${editingComment._id}`, { content: postComment })
                .then((_) => {
                    setPostComment("")
                    setIsEditing(false)
                    axios.get(`/comment/v/${videoId}`)
                        .then((value) => {
                            setAllComment(value.data.data);
                        })
                        .catch((error) => {
                            console.error(error.message);
                        })
                })
                .catch((error) => {
                    if (error.status === 401) {
                        toast.error("You need to login first", {
                            style: { color: "#ffffff", backgroundColor: "#333333" },
                            position: "top-center"
                        })
                        dispatch(logout())
                        navigate("/login")
                    }
                    console.error(errorMessage(error));
                })
                .finally(() => setIsCommentSubmitting(false))
        }
    }

    const toggleLike = () => {
        axios.post(`/like/toggle/v/${videoId}`)
            .then((res) => {
                
                if (res.data.message.trim().toLowerCase() === "liked") {
                    setLike({ _id: video._id, totalLikes: like.totalLikes + 1, isLiked: true })
                } else if (res.data.message.trim().toLowerCase() === "like removed") {
                    setLike({ _id: video._id, totalLikes: like.totalLikes - 1, isLiked: false })
                } else {
                    setLike(like)
                }
            })
            .catch((error) => {
                if (error.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    dispatch(logout())
                    navigate("/login")
                }
                console.error(errorMessage(error));
                setLike(like)
            })
    }

    const handleEnter = (e) => {
        if ((e.key === "Enter" && !e.nativeEvent.shiftKey) && postComment && !isCommentSubmitting) {
            handleVideoComment();
        }
    };

    useEffect(() => {
        setError("")
        axios.get(`/videos/${videoId}`)
            .then((value) => {
                setVideo(value.data.data.video);
                setLike(value.data.data.likes);

                axios.get(`/comment/v/${videoId}`)
                    .then((value) => {
                        setAllComment(value.data.data);
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });

                axios.get(`/subscription/u/${value.data.data.video.owner._id}`)
                    .then((value) => {
                        setSub(value.data.data.subscribers);
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });

                axios.get(`/subscription/i/${value.data.data.video.owner._id}`)
                    .then((value) => {
                        setSubscribed(value.data.data);
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });
            })
            .catch((error) => {
                const htmlString = error?.response?.data;
                const match = htmlString?.match(/Error:.*?(?=<br>)/);
                match ? setError(match[0].slice(7)) : setError(error.message);
            })
            .finally(() => setLoader(false));
    }, [])

    if (loader) {
        return (<div className='w-full h-full flex justify-center items-center'>
            <LoaderCircle className="w-16 h-16 animate-spin" />
        </div>)
    }

    if (error) {
        return (<div className='content-center text-center w-full h-full'>{error}</div>)
    }

    return (
        <>
            <section className="w-full">
                <div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
                    <div className="col-span-12 w-full">
                        <div className="relative aspect-video mb-4 w-full rounded-lg border border-primary/30">
                            <div className="absolute inset-0">
                                <video
                                    className="h-full w-full rounded-lg"
                                    controls
                                    autoPlay
                                    controlsList='nodownload'
                                    poster={video.thumbnail}
                                >
                                    <source
                                        src={video.videoFile}
                                        type="video/mp4" />
                                </video>
                            </div>
                        </div>
                        <div className="mb-4 w-full rounded-lg border border-primary/30 p-4 duration-200">
                            <div className="flex flex-wrap gap-y-2">
                                <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                                    <h1 className="text-lg w-min font-bold" title={video.title}>{video.title}</h1>
                                    <div className="flex text-sm w-max text-sidebar-foreground/95" title={`${formatNumbers(video.views)} views | uploaded ${timeAgo(video.createdAt)}`}>
                                        <p>{formatNumbers(video.views)} views </p>
                                        <p className=" before:content-['•'] before:px-2">{timeAgo(video.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 lg:w-full xl:w-1/2">
                                    <div className="flex items-center justify-between gap-x-4 md:justify-end lg:justify-between xl:justify-end">
                                        <div className="flex">
                                            <Button
                                                className="flex items-center border font-medium text-lg border-primary/50 shadow-none gap-x-2 border-r bg-border text-primary hover:bg-primary/20 after:content-[attr(data-like)] [&_svg]:size-5"
                                                data-like={formatNumbers(like.totalLikes)} onClick={toggleLike}>
                                                <span className="inline-block">
                                                    {like.isLiked ? <Like className='fill-[#ae7aff] text-border' /> : <Like className='fill-transparent' />}
                                                </span>
                                            </Button>
                                            {/* dislike button */}
                                            {/* <button
                                                className="group/btn flex items-center gap-x-2 px-4 py-1.5 after:content-[attr(data-like)] hover:bg-white/10 focus:after:content-[attr(data-like-alt)]"
                                                data-like="20"
                                                data-like-alt="21">
                                                <span className="inline-block w-5 group-focus/btn:text-[#ae7aff]">
                                                </span>
                                            </button> */}
                                        </div>
                                        <div className="relative block">
                                            {/* playlist btn */}

                                            {/* <button className="peer flex items-center gap-x-2 rounded-lg bg-white px-4 py-1.5 text-black">
                                                <span className="inline-block w-5">
                                                    <PlaylistBtn />
                                                </span>
                                                Save
                                            </button>
                                            <div className="absolute right-0 top-full z-10 hidden w-64 overflow-hidden rounded-lg bg-[#121212] p-4 shadow shadow-slate-50/30 hover:block peer-focus:block">
                                                <h3 className="mb-4 text-center text-lg font-semibold">Save to playlist</h3>
                                                <ul className="mb-4">
                                                    <li className="mb-2 last:mb-0">
                                                        <label
                                                            className="group/label inline-flex cursor-pointer items-center gap-x-3"
                                                            for="Collections-checkbox">
                                                            <Input
                                                                type="checkbox"
                                                                className="peer hidden"
                                                                id="Collections-checkbox" />
                                                            <span
                                                                className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] border border-transparent bg-white text-white group-hover/label:border-[#ae7aff] peer-checked:border-[#ae7aff] peer-checked:text-[#ae7aff]">
                                                                <Tick />
                                                            </span>
                                                            Collections
                                                        </label>
                                                    </li>
                                                </ul>
                                                <div className="flex flex-col">
                                                    <label
                                                        for="playlist-name"
                                                        className="mb-1 inline-block cursor-pointer">
                                                        Name
                                                    </label>
                                                    <Input
                                                        className="w-full rounded-lg border border-transparent bg-white px-3 py-2 text-black outline-none focus:border-[#ae7aff]"
                                                        id="playlist-name"
                                                        placeholder="Enter playlist name" />
                                                    <button className="mx-auto mt-4 rounded-lg bg-[#ae7aff] px-4 py-2 text-black">Create new playlist</button>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <AccountHover user={{ ...video.owner, isSubscribed: subscribed, subscribers: sub.length }} toggleSubscribe={toggleSubscribe}>
                                    <div className="flex items-center gap-x-4 group cursor-pointer" onClick={() => navigate(`/@${video.owner.username}`)}>
                                        <Avatar className='h-12 w-12'>
                                            <AvatarImage src={setAvatar(video.owner.avatar)} className="object-cover" />
                                        </Avatar>
                                        <div className="block">
                                            <p className="font-bold relative">
                                                {video.owner.fullName}{video.owner.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                                    <BadgeCheck title="verified" className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                                                </span>}</p>
                                            <p className="text-sm text-sidebar-foreground/95">{formatNumbers(sub.length)} Subscribers</p>
                                        </div>
                                    </div>
                                </AccountHover>
                                <div className="block">
                                    <Button
                                        className="gap-0 group flex w-full items-center hover:bg-[#b689ff] bg-[#ae7aff] text-center text-primary sm:w-auto" onClick={() => toggleSubscribe(video.owner._id)}>
                                        {subscribed ? <>
                                            <span className=" w-5 inline-block group-hover:text-red-600">
                                                <UserRoundCheck />
                                            </span>
                                            <span data-subscribed="Subscribed" data-unsubscribe="Unsubscribe" className='w-20 group-hover:after:content-[attr(data-unsubscribe)] after:content-[attr(data-subscribed)] group-hover:text-red-600'></span></> :
                                            <>
                                                <span className="inline-block w-5">
                                                    <UserRoundPlus />
                                                </span>
                                                <span className='w-20'>Subscribe</span>
                                            </>}
                                    </Button>
                                </div>
                            </div>
                            <hr className="my-4 border-primary" />
                            <div className={`relative`} role="button" tabIndex="0" onClick={() => setFullDesc(!fullDesc)}>
                                <p className={`relative text-sm cursor-pointer ${fullDesc ? "h-auto" : " line-clamp-3 "}`}>
                                    {video.description}
                                </p>
                            </div>
                        </div>
                        <button type='button' className="peer w-full border-primary/30 rounded-lg border p-4 text-left text-primary duration-200 sm:hidden"><h6 className="font-semibold">{formatNumbers(allComment.totalComments)} Comments ...</h6></button>
                        <div
                            className="fixed bg-background border-primary/30 inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none">
                            <div className="block">
                                <h6 className="mb-4 font-semibold">{formatNumbers(allComment.totalComments)} Comments</h6>
                                <div className='relative'>
                                    <textarea
                                        type="text"
                                        className="w-full resize-none h-auto max-h-20 rounded-lg border bg-transparent border-primary/90 p-2 scroll-smooth scroll-m-0 placeholder-primary"
                                        placeholder="Add a Comment"
                                        value={postComment}
                                        autoComplete="off"
                                        onChange={(e) => setPostComment(e.target.value)}
                                        onKeyDown={handleEnter}
                                        maxLength="900"
                                        ref={textArea}
                                    />
                                    <div className='flex items-center gap-3'>
                                        <Button title="send" disabled={(postComment === "") || (postComment === editingComment?.content) ? true : false} onClick={handleVideoComment}>

                                            {isCommentSubmitting ? <Loader height="24px" width="24px" className=
                                                "animate-spin fill-primary" /> : <SendHorizonal height="24px" width="24px" fill="primary" className="relative fill-primary" />}

                                        </Button>
                                        {isEditing && <Button title="cancel" onClick={handleCancelEdit}>
                                            cancel
                                        </Button>}
                                    </div>
                                </div>
                            </div>
                            <hr className="my-4 border-white" />

                            {allComment.comments ? allComment.comments.length !== 0 ? allComment.comments.map((comment) => (<div key={comment._id} className="block">
                                <div className="flex gap-x-4 relative">

                                    <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                        <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="flex h-11 w-11 shrink-0 cursor-pointer">
                                            <img
                                                src={setAvatar(comment.ownerInfo.avatar)}
                                                alt={`@${comment.ownerInfo.username}`}
                                                className="w-full h-full rounded-full object-cover" />
                                        </div>
                                    </AccountHover>
                                    <div className="block">

                                        <div className="flex items-center">
                                            <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                                <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className={`flex items-center cursor-pointer ${comment.isVideoOwner ? "font-bold" : ""}`}>
                                                    {comment.ownerInfo.fullName} {comment.ownerInfo.verified && <span className='inline-block w-min h-min ml-1 cursor-pointer' title='verified'>
                                                        <BadgeCheck title="verified" className='w-5 h-5 fill-blue-600 text-background inline-block ' />
                                                    </span>}
                                                </div>
                                            </AccountHover>

                                            <span className="text-sm flex items-center before:content-['•'] before:px-1">{timeAgo(comment.createdAt)}</span>
                                            {comment.isEdited && <span className='text-sm ml-2'>(Edited)</span>}
                                        </div>
                                        <AccountHover user={{ ...comment.ownerInfo, isSubscribed: comment.isSubscribed, subscribers: comment.subscribers }} toggleSubscribe={toggleSubscribe}>
                                            <div onClick={() => navigate(`/@${comment.ownerInfo.username}`)} className="text-sm w-min text-sidebar-foreground/85 cursor-pointer">@{comment.ownerInfo.username}</div>
                                        </AccountHover>

                                        <p className="mt-3 text-sm whitespace-pre-wrap line-clamp-5">{comment.content}</p>
                                    </div>

                                    {comment.isCommentOwner && < CommentOptions textarea={textArea} currentComment={comment} editingComment={setEditingComment} isEditing={setIsEditing} setComment={setPostComment} videoId={videoId} setAllComment={setAllComment} />}

                                </div>
                                <hr className="my-4 border-primary" />
                            </div>)) : <h1>No comments available</h1> : <p>Loading...</p>}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )



}

export default Video
