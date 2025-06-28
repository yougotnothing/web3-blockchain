package auth

import (
	"time"
	"web3-blockchain/backend/src/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(user *models.User) Tokens {
	return Tokens{
		AccessToken: jwt.NewWithClaims(
			jwt.SigningMethodES256,
			jwt.MapClaims{"id": user.ID, "email": user.Email, "exp": time.Now().Add(time.Hour * 24).Unix()}).Signature,
		RefreshToken: jwt.NewWithClaims(
			jwt.SigningMethodES256,
			jwt.MapClaims{"id": user.ID, "email": user.Email, "exp": time.Now().Add(time.Hour * 24 * 31).Unix()}).Signature,
	}
}

func RefreshTokens(user *models.User) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		token, _ := ctx.Cookie("refresh_token")
		isVerified, error := jwt.Parse(token, func(t *jwt.Token) (any, error) {
			if _, ok := t.Method.(*jwt.SigningMethodECDSA); !ok {
				return false, jwt.ErrSignatureInvalid
			}
			return true, nil
		})

		if error != nil {
			ctx.JSON(401, gin.H{"error": "Invalid token"})
			return
		}

		if isVerified.Valid {
			tokens := GenerateToken(user)

			ctx.SetCookie("refresh_token", string(tokens.RefreshToken), 360000, "/", "http://localhost:5173", true, true)
			ctx.JSON(200, gin.H{"message": "Tokens refreshed success", "access_token": tokens.AccessToken})
		}
	}
}

// func Login() gin.HandlerFunc {
// 	return func(ctx *gin.Context) {
// 		var loginDto LoginDto

// 		if err := ctx.ShouldBindJSON(&loginDto); err != nil {
// 			ctx.JSON(400, gin.H{"error": err.Error()})
// 			return
// 		}
// 	}
// }
