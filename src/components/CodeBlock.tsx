import SyntaxHighlighter from 'react-syntax-highlighter';
// import { hybrid } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface IProps {
    code: string,
    language: string,
    showLineNumbers?: boolean,
}

const CodeBlock = (props: IProps) => {
  return (
    <div style={{textAlign:'left'}}>
        <SyntaxHighlighter 
        language={props.language} 
        // style={hybrid}
        showLineNumbers={props.showLineNumbers}
        >
        {props.code}
        </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;