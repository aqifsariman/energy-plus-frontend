import styles from './FormWrapper.module.css'

const FormWrapper = props => {
    return(
    <div className={styles.wrapper}>
    {props.children}
    </div>
    )
};

export default FormWrapper;
