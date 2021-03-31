import SyntaxHighlighter from 'react-syntax-highlighter';

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
        showLineNumbers={props.showLineNumbers}
        >
        {props.code}
        </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;