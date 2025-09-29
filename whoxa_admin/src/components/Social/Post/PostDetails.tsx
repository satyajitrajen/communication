import React, { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import useApiPost from '../../../hooks/PostData';
import { Swiper as ReactSwiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import '../../../../src/assets/css/scrollbar.css'; // Adjust path as necessary
import LikeList from './LikeList'; // Adjust the path according to your file structure
import CommentsList from './ListComments'; // Adjust the path according to your file structure

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

interface PostDetailWithTabsProps {
    postId: number;
    LikeCount: number;
    CommentCount: number;
    selectedTab?: 'likes' | 'comments'; // Optional prop for initial selected tab
}

const PostDetailWithTabs: React.FC<PostDetailWithTabsProps> = ({ postId, LikeCount, CommentCount, selectedTab = 'comments' }) => {
    const { postData, loading, error } = useApiPost();
    const [postDetails, setPostDetails] = useState<PostDetails | null>(null);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
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

        fetchPostDetails();
    }, [postId]);

    if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading...</p></div>;
    if (error) return <div className="flex justify-center items-center h-screen"><p className="text-xl text-red-600">Error: {error.message}</p></div>;

    return (
        <div className="p-4 dark:text-white">
            {postDetails && (
                <div className="mb-4">
                    <div className="mb-4">
                        {postDetails.images.length > 0 && (
                            <ReactSwiper
                                modules={[Navigation, Pagination]}
                                slidesPerView={1}
                                spaceBetween={10}
                                loop={false}
                                pagination={{ clickable: true }}
                                className="swiper-container mb-4"
                            >
                                {postDetails.images.map((media, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={media.media_location} alt={`Post Media ${index + 1}`} className="w-full h-60 object-cover" />
                                    </SwiperSlide>
                                ))}
                            </ReactSwiper>
                        )}
                    </div>
                    <div className="flex items-start mb-4">
                        <div className="mr-4">
                            {postDetails.profile?.profile_pic && postDetails.profile?.profile_pic !== "http://192.168.0.27:3008/uploads/profile-image.jpg" ? (
                                <img src={postDetails.profile.profile_pic} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold dark:bg-gray-700">
                                    {postDetails.profile?.first_name?.[0]}{postDetails.profile?.last_name?.[0]}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-semibold text-primary">{postDetails.profile.first_name} {postDetails.profile.last_name}</h3>
                            <p className="text-sm text-gray-700 dark:text-white mb-4">{postDetails.description}</p>
                        </div>
                    </div>
                </div>
            )}

            <Tab.Group defaultIndex={selectedTab === 'likes' ? 0 : 1}>
                <Tab.List className="flex justify-around space-x-4 border-b border-gray-300 dark:border-gray-600 mb-4">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? 'border-b-2 border-primary text-primary' : ''
                                } block py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 transition duration-300 ease-in-out`}
                            >
                                Likes({LikeCount})
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${
                                    selected ? 'border-b-2 border-primary text-primary' : ''
                                } block py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 transition duration-300 ease-in-out`}
                            >
                                Comments({CommentCount})
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels >
                    <Tab.Panel className="transition duration-500 ease-in-out transform">
                        <LikeList postId={postId} />
                    </Tab.Panel>
                    <Tab.Panel className="transition duration-500 ease-in-out transform">
                        <CommentsList postId={postId} />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default PostDetailWithTabs;
