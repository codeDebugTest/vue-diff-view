# vue-diff-view
> a git diff component for Vue.js

## Usage
``` javascript
<template>
    <div id="app">
        <code-diff-viewer :new-content="newStr" :old-content="oldStr" title="测试修改"/>
    </div>
</template>

<script>
import CodeDiffViewer from 'VueDiffView';

export default {
    name: 'app',
    components: {
        CodeDiffViewer
    },
    data() {
        return {
            oldStr: '[\n    {\n        name: title\n        displayName: "标题"\n        datatype: "OBJECT"\n    }\n]',
            newStr: '[\n    {\n        name: title\n        displayName: "TAB"\n        datatype: "ARRAY"\n    }\n    {\n        name: title\n        displayName: "TAB"\n        datatype: "ARRAY"\n    }\n]'
        };
    }
};
</script>
```

## Overview

### diff result
![add delete file](https://github.com/codeDebugTest/vue-diff-view/raw/master/screenshots/add_delete.png)

![modify file](https://github.com/codeDebugTest/vue-diff-view/raw/master/screenshots/modify.png)

### todo
when select code, not trigger line number.