package auth

import (
	"net/http"
	"os"
	"strings"
	"time"
	"web3-blockchain/backend/src/models"

	gv "github.com/bube054/ginvalidator"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func GenerateAccessToken(id uuid.UUID, secret string) (string, error) {
	return jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"id": id, "exp": time.Now().Add(time.Hour * 7).Unix()}).SignedString([]byte(secret))
}

func GenerateRefreshToken(id uuid.UUID, secret string) (string, error) {
	return jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"id": id, "exp": time.Now().Add(time.Hour * 24 * 31).Unix()}).SignedString([]byte(secret))
}

func GenerateToken(user *models.User) Tokens {
	token := func(exp int64) *jwt.Token {
		return jwt.NewWithClaims(
			jwt.SigningMethodHS256,
			jwt.MapClaims{"id": user.ID, "email": user.Email, "exp": exp})
	}
	accessToken, accessErr := token(time.Now().Add(time.Hour * 24).Unix()).SignedString([]byte("secret"))
	refreshToken, err := token(time.Now().Add(time.Hour * 24 * 31).Unix()).SignedString([]byte("secret"))

	if accessErr != nil {
		panic(accessErr)
	} else if err != nil {
		panic(err)
	}

	return Tokens{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
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

		accessToken, _ := GenerateAccessToken(user.ID, os.Getenv("SECRET"))
		refreshToken, _ := GenerateRefreshToken(user.ID, os.Getenv("SECRET"))

		ctx.SetCookie("refresh_token", refreshToken, 360000, "/", "http://localhost:5173", true, true)
		ctx.JSON(200, gin.H{"message": "Logged in success", "access_token": accessToken})
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

		if err := db.Create(&user).Error; err != nil {
			ctx.JSON(500, gin.H{"error": err})
			return
		}

		ctx.JSON(200, gin.H{"message": "User registered successfully"})
	}
}

func Refresh(ctx *gin.Context) {
	refreshToken, err := ctx.Cookie("refresh_token")

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if refreshToken == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Refresh token is missing"})
		return
	}

	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid refresh token"})
			return nil, nil
		}
		return []byte(os.Getenv("SECRET")), nil
	})

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	userID := token.Claims.(jwt.MapClaims)["id"].(string)

	if userID == "" {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid credentials"})
		return
	}

	accessToken, _ := GenerateAccessToken(uuid.FromStringOrNil(userID), os.Getenv("SECRET"))
	newRefreshToken, _ := GenerateRefreshToken(uuid.FromStringOrNil(userID), os.Getenv("SECRET"))
	ctx.SetCookie("refresh_token", newRefreshToken, 360000, "/", "http://localhost:5173", true, true)
	ctx.JSON(200, gin.H{"message": "Access token refreshed successfully", "access_token": accessToken})
}

func ExtractUserID(ctx *gin.Context) string {
	authHeader := strings.Split(ctx.GetHeader("Authorization"), " ")[1]
	if authHeader == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Authorization header is missing"})
		return ""
	}

	token, err := jwt.Parse(authHeader, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token"})
			return nil, nil
		}
		return []byte(os.Getenv("SECRET")), nil
	})

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return ""
	}

	userID := token.Claims.(jwt.MapClaims)["id"].(string)

	if userID == "" {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid credentials"})
		return ""
	}

	return userID
}
