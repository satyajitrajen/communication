import React, { useEffect, useState } from 'react';
import useApiPost from '../../../hooks/PostData';
import { formatDistanceToNow, format, differenceInDays } from 'date-fns';
import "../../../../src/assets/css/scrollbar.css";

interface Like {
    like_id: number;
    createdAt: string;
    Profile: {
        profile_pic?: string;
        user_name?: string;
        first_name?: string;
        last_name?: string;
    } | null;
}

interface LikesListProps {
    postId: number;
}

const LikesList: React.FC<LikesListProps> = ({ postId }) => {
    const { postData, loading, error } = useApiPost();
    const [likes, setLikes] = useState<Like[]>([]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await postData('showLike', { postId });
                if (response && response.isLiked && response.isLiked.rows) {
                    setLikes(response.isLiked.rows);
                }
            } catch (err) {
                console.error("Failed to fetch likes data", err);
            }
        };

        fetchLikes();
    }, [postId]);

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
                {likes.length > 0 ? (
                    likes.map((like) => {
                        const timeAgo = formatTime(like.createdAt);

                        return (
                            <div key={like.like_id} className="flex flex-col sm:flex-row items-start pt-5 bg-white shadow-md rounded-lg p-4 dark:bg-[#23283e] dark:shadow-none mb-4">
                                <div className="h-12 w-12 flex-none mb-4 sm:mb-0 sm:mr-4">
                                    {like.Profile?.profile_pic && like.Profile?.profile_pic !== "http://192.168.0.27:3008/uploads/profile-image.jpg" ? (
                                        <img src={like.Profile.profile_pic} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold dark:bg-gray-700">
                                            {like.Profile?.first_name?.[0]}{like.Profile?.last_name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-auto">
                                    <div className='flex w-full justify-between'>
                                        <span className="mb-1 text-base font-medium text-gray-900 dark:text-white">
                                            {like.Profile?.first_name} {like.Profile?.last_name}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 ">{timeAgo}</span>
                                    </div>
                                    <p className="text-gray-800 dark:text-gray-400 text-sm mb-2 w-full sm:w-72">
                                        {like.Profile?.user_name}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-gray-300 bg-gray-700 w-full h-1/2 rounded-lg">
                        <div className='py-8'>No likes yet.</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LikesList;
