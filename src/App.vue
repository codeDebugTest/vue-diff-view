<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <diff-viewer :new-str="newStr" :old-str="oldStr" title="测试删除"/>
        <diff-viewer :new-str="oldStr" :old-str="newStr" title="测试添加"/>
        <diff-viewer :new-str="modifiedStr" :old-str="oldStr" title="测试修改"/>
    </div>
</template>

<script>
import DiffViewer from './components/DiffViewer.vue';

export default {
    name: 'app',
    components: {
        DiffViewer
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
