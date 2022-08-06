import styles from './AuthForm.module.css'

const AuthForm = props => {
    return(
        <form className={styles.form} onSubmit={props.onSubmit}>{props.children} </form>
    )
};

export default AuthForm;