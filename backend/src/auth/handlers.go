package auth

import (
	"net/http"
	"time"
	"web3-blockchain/backend/src/models"

	gv "github.com/bube054/ginvalidator"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
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

func Login(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var loginDto LoginDto
		var user models.User

		if err := ctx.ShouldBindJSON(&loginDto); err != nil {
			ctx.JSON(400, gin.H{"error": err.Error()})
			return
		}

		if err := db.First(&user, "email = ?", loginDto.Email).Error; err != nil {
			ctx.JSON(400, gin.H{"error": err.Error()})
			return
		}

		if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginDto.Password)) != nil {
			ctx.JSON(401, gin.H{"error": "Invalid credentials"})
			return
		}

		tokens := GenerateToken(&user)

		ctx.SetCookie("refresh_token", string(tokens.RefreshToken), 360000, "/", "http://localhost:5173", true, true)
		ctx.JSON(200, gin.H{"message": "Logged in success", "access_token": tokens.AccessToken})
	}
}

func Register(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var registerDto RegisterDto
		var user models.User
		if result, err := gv.ValidationResult(ctx); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		} else if result != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": result})
			return
		}

		if err := ctx.ShouldBindJSON(&registerDto); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if err := db.First(&user, "email = ?", registerDto.Email).Error; err == nil {
			ctx.JSON(400, gin.H{"error": "Email already exists"})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(registerDto.Password), 12)

		if err != nil {
			ctx.JSON(500, gin.H{"error": err.Error()})
			return
		}

		user.Password = string(hashedPassword)
		user.Email = registerDto.Email
		user.Name = registerDto.Name
		user.CreatedAt = time.Now()

		if err := db.Create(&user).Error; err != nil {
			ctx.JSON(500, gin.H{"error": err})
			return
		}

		ctx.JSON(200, gin.H{"message": "User registered successfully"})
	}
}
