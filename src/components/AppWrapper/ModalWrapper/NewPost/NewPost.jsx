import React, {useState} from 'react';
import { ToastsStore } from 'react-toasts';

export default function NewPost({parentPostId, setIsOpen, postType}){
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  
  const handleTitleChange = event => {
    setTitle(event.target.value)
  };

  const handleBodyChange = event => {
    setBody(event.target.value)
  };
  
  function savePost(event, postType) {
    event.preventDefault()
    const requestParams = {
      method: 'POST',
      headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        parentId: parentPostId || null,
        title: title,
        body: body
      })
    };
    fetch(`/${postType}`, requestParams)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
      })
      .then(ToastsStore.success("Post saved."))
      .then(setIsOpen(false));
  }

  return (
    <form className='new-post-form'>
      { typeof(parentPostId) === 'undefined' && 
      <div>
        <label name='title'>Title</label>
        <input type='text' label='title' onChange={handleTitleChange} value={title} />
      </div>
      }
      <div>
        <label name='body'></label>
        <textarea label='body' onChange={handleBodyChange} value={body} />
        {/* <div id="editor"></div> */}
      </div>
      <button className='save-button button-large' onClick={(event) => savePost(event, postType)}>
        { typeof(parentPostId) === 'undefined' ? 'Save' : 'Reply' }
      </button>
    </form>
  )
}
