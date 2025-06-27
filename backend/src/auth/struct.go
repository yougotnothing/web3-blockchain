package auth

type Tokens struct {
	AccessToken  []byte `json:"access_token"`
	RefreshToken []byte `json:"refresh_token"`
}

type LoginDto struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Message     string `json:"message"`
	AccessToken string `json:"access_token"`
}
