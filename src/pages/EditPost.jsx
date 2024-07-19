import { useEffect, useState } from 'react';
import { Container, PostForm } from '../components';
import postServices from '../services/postService';
import { useNavigate, useParams } from 'react-router-dom';

function EditPost() {
    const [post, setPost] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPostById = async () => {
            try {
                const fetchedPost = await postServices.getPost(id);
                if (fetchedPost && fetchedPost.post) {
                    setPost(fetchedPost.post);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching post:', error);
                navigate('/');
            }
        };

        if (id) {
            fetchPostById();
        } else {
            navigate('/');
        }
    }, [id, navigate]);

    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null;
}

export default EditPost;
