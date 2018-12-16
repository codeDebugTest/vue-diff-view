<template>
    <div class="diff-chunk">
        <div v-if="chunk.collapse"
                class="collapse-tip"
                @click.once="$emit('expand', index)">
            ... 隐藏 {{chunk.lineCount}} 行，点击展开 ...
        </div>
        <div v-else class="line"
            v-for="(line, index) in chunk.lines"
            :key="index">
            <span v-if="chunk.type !== 'blank'"
                :class="chunk.type">{{chunk.startCount + index}}</span>
            <span v-else></span>
            <pre :class="chunk.type">{{line}}</pre>
        </div>
    </div>
</template>

<script>
export default {
    name: 'diff-chunk',
    props: {
        chunk: {
            type: Object,
            default: () => {
                return {};
            }
        },
        index: Number
    }
};
</script>

<style lang="less" scoped>
.diff-chunk {
    .line {
        display: flex;

        span {
            width: 48px;
            padding-left: 10px;
            padding-right: 10px;
            line-height: 22px;
            box-sizing: border-box;
            text-align: right;
        }
        pre {
            display: inline-block;
            margin: 0;
            padding-left: 25px;
            width: 100%;
            line-height: 22px;
            word-wrap: break-word;
            white-space: pre-wrap;
            word-break: normal;
            color: #005cc5;
            &::before {
                content: "";
                position: absolute;
            }
        }
    }

    span.add {
        background-color: #cdffd8;
    }
    span.remove {
        background-color: #ffdce0;
    }
    pre.add {
        background-color: #e6ffed;
        &::before {
            content: "+";
            margin-left: -15px;
            color: #24292e;
        }
    }

    pre.remove {
        background-color: #ffeef0;
        &::before {
            content: "-";
            margin-left: -15px;
            color: #24292e;
        }
    }

    .collapse-tip {
        height: 32px;
        line-height: 32px;
        text-align: center;
        background-color: #def;

        &:hover {
            cursor: pointer;
        }
    }

    &:last-child {
        border-radius: 0 0 5px 5px;
    }
}
</style>
