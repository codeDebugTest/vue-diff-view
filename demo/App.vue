<template>
    <div id="app">
        <code-diff-viewer :new-content="newStr" :old-content="oldStr" title="测试删除"/>
        <code-diff-viewer :new-content="oldStr" :old-content="newStr" title="测试添加"/>
        <code-diff-viewer :new-content="modifiedStr" :old-content="oldStr" title="测试修改"/>
    </div>
</template>

<script>
import CodeDiffViewer from '../src/components/CodeDiffViewer.vue';

export default {
    name: 'app',
    components: {
        CodeDiffViewer
    },
    data() {
        return {
            oldStr: '',
            newStr: ''
        };
    },
    created() {
        this.oldStr = '[\n    {\n        name: title\n        displayName: "标题"\n        datatype: "OBJECT"\n    }\n]';
        this.newStr = '';
        this.modifiedStr = '[\n    {\n        name: title\n        displayName: "TAB"\n        datatype: "ARRAY"\n    }\n    {\n        name: title\n        displayName: "TAB"\n        datatype: "ARRAY"\n    }\n]';
    }
};
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
