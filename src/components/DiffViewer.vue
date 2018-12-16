<template>
    <div class="diff-viewer">
        <h3>{{title}}</h3>
        <div class="container" v-if="newStr && oldStr">
            <div class="left">
                <div v-for="(chunk, index) in splitedLeft.chunks"
                    :key="index">
                    <diff-chunk :chunk="chunk" :index="index" @expand="expandChunk"/>
                </div>
            </div>
            <div class="right">
                <div v-for="(chunk, index) in splitedRight.chunks"
                    :key="index">
                    <diff-chunk :chunk="chunk" :index="index" @expand="expandChunk"/>
                </div>
            </div>
        </div>
        <template v-else>
            <div v-for="(chunk, index) in unifiedResult"
                :key="index">
                <diff-chunk :chunk="chunk" :index="index"/>
            </div>
        </template>
    </div>
</template>

<script>
import {diffLines} from 'diff/lib/diff/line';
import DiffChunk from './DiffChunk';
import {clone} from 'lodash';

export default {
    name: 'diff-view',
    components: {
        'diff-chunk': DiffChunk
    },
    props: {
        oldStr: String,
        newStr: String,
        title: String,
        collapse: {
            type: Number,
            default: 3 // 连续超过10行没改动，默认折叠
        }
    },
    data() {
        return {
            unifiedResult: [],
            splitedLeft: {
                chunks: [],
                lineNumber: 1
            },
            splitedRight: {
                chunks: [],
                lineNumber: 1
            }
        };
    },
    created() {
        this.diff();
        this.splitDiffCompare();
    },
    methods: {
        diff() {
            // 修改
            if (this.newStr && this.oldStr) {
                let diffs = diffLines(this.oldStr, this.newStr);
                this.unifiedResult = diffs.map((chunk, index) => {
                    let type = chunk.added ? 'add' : (chunk.removed ? 'remove' : '');
                    let lines = chunk.value.split('\n');
                    let lineCount = lines.length;
                    let collapse = !type && lineCount > this.collapse;
                    return {
                        type,
                        lines,
                        lineCount,
                        collapse
                    };
                });
            }
            else {
                // 新增 or 删除
                let diffs = this.newStr || this.oldStr;
                let lines = diffs.split('\n');
                let type = !this.newStr ? 'remove' : (!this.oldStr ? 'add' : '');
                this.unifiedResult = [{
                    type,
                    lines,
                    lineCount: lines.length,
                    startCount: 1
                }];
            }
        },
        splitDiffCompare() {
            if (!this.newStr || !this.oldStr) {
                return;
            }
            this.unifiedResult.forEach((chunk, index) => {
                if (chunk.type === 'add') {
                    this.splitChunk(this.splitedRight, chunk);

                    if (this.shouldSetBlank(chunk.type, index)) {
                        this.splitedLeft.chunks.push(this.createBlankChunk(chunk.lineCount));
                    }
                }
                else if (chunk.type === 'remove') {
                    this.splitChunk(this.splitedLeft, chunk);

                    if (this.shouldSetBlank(chunk.type, index)) {
                        this.splitedRight.chunks.push(this.createBlankChunk(chunk.lineCount));
                    }
                }
                else {
                    // 没有变动，两边放入。
                    this.splitChunk(this.splitedLeft, chunk);

                    let clonedChunk = clone(chunk);
                    this.splitChunk(this.splitedRight, clonedChunk);
                }
            });
        },
        splitChunk(part, chunk) {
            chunk.startCount = part.lineNumber;
            part.lineNumber += chunk.startCount;
            part.chunks.push(chunk);
        },
        /**
         * 是否应该设置空白块：
         *    1. 最后一块返回 true
         *    2. 当前块是‘remove'类型，看下一块类型是否为空
         *    3. 当前块是‘add'类型，看上一块类型是否为空
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

            let chunk = this.unifiedResult[index];
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
        expandChunk(index) {
            this.splitedLeft.chunks[index].collapse = false;
            this.splitedRight.chunks[index].collapse = false;
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
