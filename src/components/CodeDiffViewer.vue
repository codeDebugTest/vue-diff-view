<template>
    <div class="diff-viewer">
        <h3>{{title}}</h3>
        <div class="container" v-if="newContent && oldContent">
            <div class="left">
                <code-chunk v-for="(chunk, index) in splitedLeft"
                    :key="index"
                    :chunk="chunk" @expand="expandChunk"/>
            </div>
            <div class="right">
                <code-chunk v-for="(chunk, index) in splitedRight"
                    :key="index"
                    :chunk="chunk" @expand="expandChunk"/>
            </div>
        </div>
        <div v-else v-for="(chunk, index) in unifiedResult"
            :key="index">
            <code-chunk :chunk="chunk" :index="index"/>
        </div>
    </div>
</template>

<script>
import {diffLines} from 'diff/lib/diff/line';
import CodeChunk from './CodeDiffChunk.vue';

export default {
    name: 'code-iff-viewer',
    components: {
        CodeChunk
    },
    props: {
        oldContent: String,
        newContent: String,
        title: String,
        collapse: {
            type: Number,
            default: 10 // 连续超过10行没改动，默认折叠
        }
    },
    data() {
        return {
            unifiedResult: [],
            splitedLeft: [],
            splitedRight: []
        };
    },
    created() {
        this.calculateDiff();
    },
    watch: {
        'title'(v) {
            this.calculateDiff();
        }
    },
    methods: {
        calculateDiff() {
            this.unifiedResult = this.diff();
            this.splitedLeft = [];
            this.splitedRight = [];
            if (this.unifiedResult.length) {
                const {left, right} = this.splitDiffResult(this.unifiedResult);
                this.adaptSplitResult(left, right);
            }
        },
        diff() {
            // 修改
            if (this.newContent && this.oldContent) {
                const diffs = diffLines(this.oldContent, this.newContent, {
                    ignoreWhitespace: false
                });
                const length = diffs.length;
                return diffs.map((chunk, index) => {
                    const type = chunk.added ? 'add' : (chunk.removed ? 'remove' : '');
                    // delete last element of array, because split will produce more one line.
                    let lines = chunk.value.split('\n');
                    lines = index === length - 1 ? lines.slice(0) : lines.slice(0, -1);
                    return {
                        type,
                        lines,
                        lineCount: lines.length,
                        collapse: !type && lines.length > this.collapse
                    };
                });
            }
            else if (this.newContent || this.oldContent) {
                // 新增 or 删除
                const diffs = this.newContent || this.oldContent;
                const lines = diffs.split('\n');
                const type = !this.newContent ? 'remove' : (!this.oldContent ? 'add' : '');

                return [{
                    type,
                    lines,
                    lineCount: lines.length,
                    startCount: 1
                }];
            }
            return [];
        },

        /**
         * 由于 diff库返回的结果是 chunk list非双边对比结果，所以这里做了处理
         *  1. 新增块放入右侧，如果下一块为删除块则视为更改代码，此时左侧需补充空行。
         *  2. 删除块放入左侧，如果下一块为新增块则视为更改代码, 此时右侧补充空行。
         *  3. 无变化块，两边都需放入。
         *
         * @param {Array} diffResult diff库调用返回的结果
         * @return {Object} {left, right} 左右分离结果
        */
        splitDiffResult(diffResult) {
            const left = {
                chunks: [],
                lineCount: 1
            };
            const right = {
                chunks: [],
                lineCount: 1
            };
            const setChunkLineNumber = (chunk, lineNumer) => {
                chunk.startLineNumber = lineNumer;
                return lineNumer + chunk.lineCount;
            };

            diffResult.forEach((chunk, index) => {
                if (chunk.type === 'add') {
                    right.lineCount = setChunkLineNumber(chunk, right.lineCount);
                    right.chunks.push(chunk);
                    // 判断是否增加空白块
                    if (this.shouldSetBlank(chunk.type, index)) {
                        left.chunks.push(this.createBlankChunk(chunk.lineCount));
                    }
                }
                else if (chunk.type === 'remove') {
                    left.lineCount = setChunkLineNumber(chunk, left.lineCount);
                    left.chunks.push(chunk);
                    // 判断是否增加空白块
                    if (this.shouldSetBlank(chunk.type, index)) {
                        right.chunks.push(this.createBlankChunk(chunk.lineCount));
                    }
                }
                else {
                    // 没有变动，两边放入。
                    left.lineCount = setChunkLineNumber(chunk, left.lineCount);
                    left.chunks.push(chunk);

                    const clonedChunk = {...chunk};
                    right.lineCount = setChunkLineNumber(clonedChunk, right.lineCount);
                    right.chunks.push(clonedChunk);
                }
            });
            return {left, right};
        },
        adaptSplitResult(left, right) {
            left.chunks.forEach((leftChunk, index) => {
                const rightChunk = right.chunks[index];
                if (leftChunk.collapse && rightChunk.collapse) {
                    // 记录下左右栏chunk index; 点击展开时，通过此index定位chunk进行展开。
                    leftChunk.leftIndex = rightChunk.leftIndex = this.splitedLeft.length;
                    leftChunk.rightIndex = rightChunk.rightIndex = this.splitedRight.length;
                }

                this.splitedLeft.push(leftChunk);
                this.splitedRight.push(rightChunk);

                // 修改的行数不一致时，补充空白块。例如：左栏删除 3行，右栏添加5行代码。则左栏需补充 2行空白，进行对齐。
                if (leftChunk.type === 'remove' && rightChunk.type === 'add') {
                    const count = leftChunk.lineCount - rightChunk.lineCount;
                    if (count < 0) {
                        this.splitedLeft.push(this.createBlankChunk(Math.abs(count)));
                    }
                    else if (count > 0) {
                        this.splitedRight.push(this.createBlankChunk(count));
                    }
                }
            });
        },

        /**
         * 是否应该设置空白块：
         *    1. 最后一块返回 true
         *    2. 当前块是‘remove'类型，看下一块类型是否为空（没有变化）
         *    3. 当前块是‘add'类型，看上一块类型是否为空(没有变化)
         *
         * @param {type} type 当前块类型
         * @param {inddex} index 当前块索引
         * @return {boolean}
         */
        shouldSetBlank(type, index) {
            if (index === this.unifiedResult.length - 1) {
                return true;
            }
            index = type === 'remove' ? index + 1 : index - 1;

            const chunk = this.unifiedResult[index];
            return !chunk || !chunk.type;
        },

        /**
         * 创建空白块
         *
         * @param {number} lineCount 行数
         * @return {Object} 空白块对象
         */
        createBlankChunk(lineCount) {
            return {
                type: 'blank',
                lineCount,
                lines: new Array(lineCount).fill(' ')
            };
        },
        expandChunk(leftIndex, rightIndex) {
            this.splitedLeft[leftIndex].collapse = false;
            this.splitedRight[rightIndex].collapse = false;
        }
    }
};
</script>

<style lang="less" scoped>
.diff-viewer {
    font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace, sans-serif;
    font-size: 12px;
    margin-bottom: 15px;
    border-radius: 5px;
    border: 1px solid #ddd;

    h3 {
        box-sizing: border-box;
        margin: 0;
        padding: 5px 10px;
        height: 40px;
        line-height: 30px;
        border-radius: 5px 5px 0 0;
        border-bottom: 1px solid #dbdbdb;
        background-color: #f7f7f7;
        color: #333;
        font-weight: 600;
    }

    .container {
        display: flex;
        > div {
            width: 50%;
        }
    }
}
</style>
