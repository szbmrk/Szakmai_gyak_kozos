import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/list.css';

const ContentList = () => {
    const [contents, SetContents] = useState([]);
    const { courseId } = useParams();

    useEffect(() => {
        fetch(`/courses/${courseId}/contents`)
            .then((response) => response.json())
            .then((data) => SetContents(data))
            .catch((error) => console.error('Error retrieving contents:', error));
    }, [courseId]);

    return (
        <div data-theme="student" className="list-container-contents">
            <h1>Content List</h1>
            {contents.map((content) => (
                <div key={content.content_id} className="content-item">
                    <h2>{content.title}</h2>
                    <p>{content.lecture_text}</p>
                </div>
            ))}
        </div>
    );
};

export default ContentList;
