import React, { useState, useRef } from 'react';
import { ToastsStore } from 'react-toasts';
import { getHeaders, capitalizeFirstLetter } from '../../../../util/util';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function NewPost({parentPostId, user, setIsOpen, postType, post}){
  const [title, setTitle] = useState(post?.title || '');
  const [body, setBody] = useState(post?.body || '');
  const isReply = typeof(parentPostId) !== 'undefined';
  const postTypeToIdMap = {
    edit_rule: post?.rule_id,
    edit_post: post?.id
  }
  const postId = post ? postTypeToIdMap[postType] : null;
  const editor = useRef();
  const saveButtonDisabled = isReply ? !body : !title || !body;

  function savePost(event, postType) {
    event.preventDefault();
    if (!body) {
      ToastsStore.error("A message is required.");
      return
    }
    if (postType !== 'reply' && !title) {
      ToastsStore.error("A title is required.");
      return
    }
    const requestParams = {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        id: postId || null,
        parentId: parentPostId || null,
        user: user,
        title: title || null,
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
          placeholder='Title'
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>
      }
      <div>
        <label name='body'></label>
        <CKEditor
          ref={editor}
          editor={ ClassicEditor }
          config={{
            toolbar: ["bold", "italic",
            "|", "link", "bulletedList", "numberedList",
            "|", "insertTable", "undo", "redo",
            ]}}
          placeholder='Message'
          onChange={ ( event, editor ) => {
            const data = editor.getData();
            console.log(title?.current?.value);
            setBody(data);
          } }
      />
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
