import React, { useEffect, useState } from 'react';
import useApiPost from '../../../hooks/PostData';
import { formatDistanceToNow, format, differenceInDays } from 'date-fns';
import { Swiper as ReactSwiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import "../../../../src/assets/css/scrollbar.css";

interface Comment {
    comment_id: number;
    comment: string;
    createdAt: string;
    commenter: {
        profile_pic?: string;
        user_name?: string;
        first_name?: string;
        last_name?: string;
    };
}

interface PostDetails {
    description: string;
    images: { media_location: string }[];
    profile: {
        profile_pic?: string;
        user_name?: string;
        first_name?: string;
        last_name?: string;
    };
}

interface CommentsListProps {
    postId: number;
}

const CommentsList: React.FC<CommentsListProps> = ({ postId }) => {
    const { postData, loading, error } = useApiPost();
    const [comments, setComments] = useState<Comment[]>([]);
    const [postDetails, setPostDetails] = useState<PostDetails | null>(null);
    const [expandedCommentIds, setExpandedCommentIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        const fetchCommentsAndPostDetails = async () => {
            try {
                // Fetch comments
                const commentsResponse = await postData('showComment', { postId });
                if (commentsResponse && commentsResponse.iscommented && commentsResponse.iscommented.rows) {
                    setComments(commentsResponse.iscommented.rows);
                }

                // Fetch post details
                const postResponse = await postData('showPostByPostId', { postId });
                if (postResponse && postResponse.PostData && postResponse.PostData.length > 0) {
                    const post = postResponse.PostData[0];
                    setPostDetails({
                        description: post.post_desc,
                        images: post.Media,
                        profile: {
                            profile_pic: post.Profile.profile_pic,
                            user_name: post.Profile.user_name,
                            first_name: post.Profile.first_name,
                            last_name: post.Profile.last_name,
                        }
                    });
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        };

        fetchCommentsAndPostDetails();
    }, [postId]);

    const toggleExpand = (commentId: number) => {
        setExpandedCommentIds((prev) => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(commentId)) {
                newExpanded.delete(commentId);
            } else {
                newExpanded.add(commentId);
            }
            return newExpanded;
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const daysDifference = differenceInDays(new Date(), date);

        if (daysDifference > 7) {
            return format(date, 'MMM d, yyyy'); // Example: Aug 12, 2024
        }

        const formattedDistance = formatDistanceToNow(date, { addSuffix: true });
        return formattedDistance
            .replace('about', '') // Remove 'about' from 'about x min ago'
            .replace('minute', 'min')
            .replace('minutes', 'mins')
            .replace('hour', 'hr')
            .replace('hours', 'hrs')
            .replace('day', 'day')
            .replace('days', 'days');
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading...</p></div>;
    if (error) return <div className="flex justify-center items-center h-screen"><p className="text-xl text-red-600">Error: {error.message}</p></div>;

    return (
        <div className="flex flex-col max-h-[47vh] max-w-xl mx-auto p-4 dark:text-white rounded-lg">

            <div className="flex-1 overflow-y-auto scrollbar pr-4 mb-4" style={{ maxHeight: 'calc(95vh - 12rem)' }}>
                {comments.length > 0 ? (
                    comments.map((comment) => {
                        const timeAgo = formatTime(comment.createdAt);
                        const isExpanded = expandedCommentIds.has(comment.comment_id);

                        return (
                            <div key={comment.comment_id} className="flex flex-col sm:flex-row items-start pt-5 bg-white shadow-md rounded-lg p-4 dark:bg-[#23283e] dark:shadow-none mb-4">
                                <div className="h-12 w-12 flex-none mb-4 sm:mb-0 sm:mr-4">
                                    {comment.commenter?.profile_pic && comment.commenter?.profile_pic !== "http://192.168.0.27:3008/uploads/profile-image.jpg" ? (
                                        <img src={comment.commenter.profile_pic} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold dark:bg-gray-700">
                                            {comment.commenter?.first_name?.[0]}{comment.commenter?.last_name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-auto">
                                    <div className='flex w-full justify-between'>
                                        <span className="mb-1 text-base font-medium text-gray-900 dark:text-white">
                                            {comment.commenter?.first_name} {comment.commenter?.last_name}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 ">{timeAgo}</span>
                                    </div>
                                    <p className={`text-gray-800 dark:text-gray-400 text-sm mb-2 w-full sm:w-72 ${isExpanded ? '' : 'line-clamp-3'}`}>
                                        {comment.comment}
                                    </p>
                                    {comment.comment.split(' ').length > 20 && (
                                        <button
                                            onClick={() => toggleExpand(comment.comment_id)}
                                            className="text-blue-500 text-sm"
                                        >
                                            {isExpanded ? 'Show Less' : 'Show More'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-gray-300 bg-gray-700 w-full h-1/2 rounded-lg">
                        <div className='py-8'>No comments yet.</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentsList;
