// 유틸리티 함수
function createWhiteCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  return canvas.toDataURL();
}

// 전역 변수로 export
export let imageEditor;

// 에디터 초기화 함수
function initEditor(container, initialValue = '') {
  if (!container) {
    throw new Error('에디터 컨테이너가 없습니다.');
  }

  try {
    const editor = new toastui.Editor({
      el: container,
      height: '500px',
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      initialValue,
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'image', 'link'],
        ['code', 'codeblock'],
        [{
          name: 'drawing',
          tooltip: '그리기 도구',
          command: 'drawingTool',
          text: '✏️',
          className: 'toastui-editor-toolbar-icons drawing'
        }]
      ]
    });

    // 그리기 도구 커맨드 등록
    editor.addCommand('markdown', 'drawingTool', () => {
      openDrawingTool(editor);
    });

    editor.addCommand('wysiwyg', 'drawingTool', () => {
      openDrawingTool(editor);
    });

    // 이미지 에디터 초기화
    imageEditor = new tui.ImageEditor('#tui-image-editor', {
      includeUI: {
        loadImage: {
          path: createWhiteCanvas(1000, 600),
          name: 'Blank'
        },
        uiSize: {
          width: '1000px',
          height: '600px'
        },
        menuBarPosition: 'left'
      }
    });

    // editor 객체에 imageEditor 추가
    editor.imageEditor = imageEditor;

    return editor;
  } catch (error) {
    console.error('에디터 초기화 오류:', error);
    throw error;
  }
}

// Viewer 초기화 함수
function initViewer(container, content = '') {
  if (!container) {
    throw new Error('뷰어 컨테이너가 없습니다.');
  }

  try {
    return new toastui.Editor.factory({
      el: container,
      viewer: true,
      initialValue: content
    });
  } catch (error) {
    console.error('뷰어 초기화 오류:', error);
    throw error;
  }
}

// 에디터 내용 가져오기
function getEditorContent(editor) {
  if (!editor) {
    throw new Error('에디터가 초기화되지 않았습니다.');
  }
  return {
    markdown: editor.getMarkdown(),
    html: editor.getHTML()
  };
}

// 에디터 내용 설정
function setEditorContent(editor, content) {
  if (!editor) {
    throw new Error('에디터가 초기화되지 않았습니다.');
  }
  editor.setHTML(content);
}

// 그리기 도구 관련 함수들
function openDrawingTool(editor) {
  document.getElementById('imageEditorPopup').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
  imageEditor.loadImageFromURL(createWhiteCanvas(1000, 600), 'Blank');
}

function closeDrawingTool() {
  document.getElementById('imageEditorPopup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

function insertAndClose() {
  const imageUrl = imageEditor.toDataURL();
  if (editor.isMarkdownMode()) {
    editor.insertText(`![drawing](${imageUrl})`);
  } else {
    editor.exec('addImage', {
      imageUrl: imageUrl,
      altText: 'drawing'
    });
  }
  closeDrawingTool();
}

// 내보내기
export {
  initEditor,
  initViewer,
  getEditorContent,
  setEditorContent,
  createWhiteCanvas
};