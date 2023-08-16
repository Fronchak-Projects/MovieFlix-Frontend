import ProfileForm from '../../components/ProfileForm';

const Profile = () => {

  return (
    <div className="main-form-container flex-col md:flex-row gap-10 md:gap-2 items-center md:items-start">
      <div className="out-form-container max-w-lg">
        <div className="form-card-container">
          <ProfileForm />
        </div>
      </div>
      <div className="out-form-container max-w-lg">
        <div className="form-card-container">
          <h3 className="form-title">Mudar senha</h3>
          <form>
            <div className="mb-3">
              <label className="label">Senha atual</label>
              <input

                type="password"
                name="old_password"
                id="old_password"
                placeholder="Senha atual"
                className={`form`}
              />
              <div className="error-form-feedback"></div>
            </div>
            <div className="mb-3">
              <label className="label">Nova senha</label>
              <input

                type="password"
                name="new_password"
                id="new_password"
                placeholder="Nova senha"
                className={`form`}
              />
              <div className="error-form-feedback"></div>
            </div>
            <div className="mb-3">
              <label className="label">Confirme a nova senha</label>
              <input

                type="password"
                name="new_password"
                id="new_password"
                placeholder="Confirme a nova senha"
                className={`form`}
              />
              <div className="error-form-feedback"></div>
            </div>
            <button
              type="submit"
              className="form-btn"
            >Mudar senha</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile;
