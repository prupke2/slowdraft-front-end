import React, { useState } from 'react';
import { ToastsStore } from 'react-toasts';
import { getHeaders, capitalizeFirstLetter } from '../../../../util/util';

export default function NewPost({parentPostId, user, setIsOpen, postType}){
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const isReply = typeof(parentPostId) !== 'undefined';
  const saveButtonDisabled = isReply ? !body : !title || !body;
  
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
      headers: getHeaders(),
      body: JSON.stringify({ 
        parentId: parentPostId || null,
        user: user,
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
        if (data.success === true) {
          const post = postType === 'create_rule' ? 'rule' : 'post';
          ToastsStore.success(`${capitalizeFirstLetter(post)} saved.`)
        } else {
          ToastsStore.error(`Error saving ${postType}.`)
        }
      })
      // .then(ToastsStore.success("Post saved."))
      .then(setIsOpen(false));
  }

  return (
    <form className='new-post-form'>
      { typeof(parentPostId) === 'undefined' && 
      <div>
        <label name='title'></label>
        <input 
          type='text' 
          label='title' 
          onChange={handleTitleChange} 
          value={title} 
          placeholder='Title (required)'
          required
        />
      </div>
      }
      <div>
        <label name='body'></label>
        <textarea 
          label='body' 
          onChange={handleBodyChange} 
          value={body} 
          placeholder='Message (required)'
          required
         />
        {/* <div id="editor"></div> */}
      </div>
      <button 
        className='save-button button-large' 
        onClick={(event) => savePost(event, postType)}
        disabled={saveButtonDisabled}
      >
        { isReply ? 'Reply' : 'Save' }
      </button>
    </form>
  )
}
