# seed for replication
set.seed(297165)
SIZES = c(100, 200, 400, 800)
NOISEDIMS = 8

# ============ UNIFORMLY DISTRIBUTED NOISE
for (n in SIZES) {
    data <- rep(1, n)
    for (i in 1:NOISEDIMS) {
        data <- cbind(data, runif(n, min = 0, max = 1))
    }
    data <- data.frame(data)
    colnames(data) <- c("class", paste("dimension", 1:NOISEDIMS))
    write.table(data, file = paste("data/uniform-", n, ".csv", sep=""), sep = ",", row.names = FALSE)
}

# ============ NORMALLY DISTRIBUTED NOISE 
for (n in SIZES) {
    data <- rep(1, n)
    for (i in 1:NOISEDIMS) {
        data <- cbind(data, rnorm(n, mean = 0.5))
    }
    data <- data.frame(data)
    colnames(data) <- c("class", paste("dimension", 1:NOISEDIMS))
    write.table(data, file = paste("data/normal-", n, ".csv", sep=""), sep = ",", row.names = FALSE)
}

# ============ LINEAR NOISE
for (n in SIZES) {
    data <- rep(1, 3*n)
    data <- cbind(data, runif(3 * n, min = -1, max = 2))
    for (i in 1:(NOISEDIMS-1)) {
        data <- cbind(data, data[, i + 1] + runif(3 * n, min = -0.1, max = 0.1))
    }
    data <- data.frame(data)
    colnames(data) <- c("class", paste("dimension", 1:NOISEDIMS))
    for (i in 1:NOISEDIMS) {
        x <- data[, paste("dimension", i)]
        #data[,paste("dimension", i)] <-  (x >= 0 && x <= 1) * x
    }
    write.table(data, file = paste("data/linear-", n, ".csv", sep=""), sep = ",", row.names = FALSE)
}

# ============ MAXIMUM VARIANCE DATA 
C = 50 # number of datapoints per cluster
for (n in SIZES) {
    data <- c(rep(2, C), rep(3, C), rep(4, C))
    data <- cbind(data, c(runif(C, min = 0, max = 0.24), runif(C, min = 0.38, max = 0.62), runif(C, min = 0.76, max = 1)))
    data <- cbind(data, c(runif(C, min = 0, max = 0.24), runif(C, min = 0.38, max = 0.62), runif(C, min = 0.76, max = 1)))
    data <- cbind(data, c(runif(C, min = 0, max = 0.24), runif(C, min = 0.38, max = 0.62), runif(C, min = 0.76, max = 1)))
    data <- cbind(data, c(runif(C, min = 0.38, max = 0.62), runif(C, min = 0.76, max = 1), runif(C, min = 0, max = 0.24)))
    data <- cbind(data, c(runif(C, min = 0.38, max = 0.62), runif(C, min = 0, max = 0.24), runif(C, min = 0.76, max = 1)))
    if (n > 0) {
        data <- rbind(cbind(rep(1, n), runif(n, min = 0, max = 1), runif(n, min = 0, max = 1), runif(n, min = 0, max = 1), runif(n, min = 0, max = 1), runif(n, min = 0, max = 1)), data)
    }
    data <- data.frame(data)
    colnames(data) <- c("class", paste("dimension", 1:5))
    write.table(data, file = paste("data/variance-", n, ".csv", sep=""), sep = ",", row.names = FALSE)
}

# ============ SYNTHETIC DATA 1
C = 30 # number of datapoints per cluster
for (n in SIZES) {
    data <- c(rep(1, C), rep(2, C), rep(3, C), rep(4, C))
    data <- cbind(data, c(runif(C, min = 0, max = 0.17), runif(C, min = 0.28, max = 0.45), runif(C, min = 0.56, max = 0.73), runif(C, min = 0.83, max = 1))) #1
    data <- cbind(data, c(runif(C, min = 0.28, max = 0.45), runif(C, min = 0, max = 0.17), runif(C, min = 0.56, max = 0.73), runif(C, min = 0.83, max = 1))) #2
    data <- cbind(data, c(runif(C, min = 0, max = 0.17), runif(C, min = 0.56, max = 0.73), runif(C, min = 0.56, max = 0.73),  runif(C, min = 0.83, max = 1))) #3
    data <- cbind(data, c(runif(C, min = 0.28, max = 0.45), runif(C, min = 0, max = 0.17), runif(C, min = 0.83, max = 1), runif(C, min = 0.73, max = 0.9))) #4
    data <- cbind(data, c(runif(C, min = 0, max = 0.17), runif(C, min = 0.04, max = 0.21), runif(C, min = 0.83, max = 1), runif(C, min = 0.59, max = 0.76))) #5
    data <- cbind(data, c(runif(C, min = 0.83, max = 1), runif(C, min = 0, max = 0.17), runif(C, min = 0.83, max = 1), runif(C, min = 0.20, max = 0.37))) #6
    data <- cbind(data, c(runif(C, min = 0, max = 0.17), runif(C, min = 0.82, max = 1), runif(C, min = 0.83, max = 1), runif(C, min = 0, max = 0.17))) #7
    data <- cbind(data, c(runif(C, min = 0.83, max = 1), runif(C, min = 0.83, max = 1), runif(C, min = 0.80, max = 0.97), runif(C, min = 0, max = 0.17))) #8
    #data <- rbind(runif(n, min = 0, max = 1), data)
    data <- data.frame(data)
    colnames(data) <- c("class", paste("dimension", 1:8))
    write.table(data, file = paste("data/synthetic-1-", n, ".csv", sep=""), sep = ",", row.names = FALSE)
}

# ============ CORRELATIONS
for (n in SIZES) {
    data <- rep(1, n)
    data <- cbind(data, sort(runif(n, min = 0, max = 1)))
    data <- cbind(data, sort(runif(n, min = 0, max = 1)))
    data <- cbind(data, sort(runif(n, min = 0, max = 1), decreasing = TRUE))
    data <- cbind(data, sort(runif(n, min = 0, max = 1), decreasing = TRUE))
    data <- cbind(data, sort(runif(n, min = 0, max = 1)))
    data <- data.frame(data)
    colnames(data) <- c("class", paste("dimension", 1:5))
    write.table(data, file = paste("data/correlations-", n, ".csv", sep=""), sep = ",", row.names = FALSE)
}

# ============ REALWORLD DATA
library("cluster.datasets")

data(acidosis.patients)
data <- data.frame(acidosis.patients)
for (c in colnames(data)) {
    x <- as.numeric(data[, c])
    data[, c] <- (x - min(x)) / (max(x) - min(x))
}
write.table(data, file = "data/realworld-acidosis-patients.csv", sep = ",", row.names = FALSE)

data(all.mammals.milk.1956)
data <- data.frame(all.mammals.milk.1956)
for (c in colnames(data)) {
    x <- as.numeric(data[, c])
    data[, c] <- (x - min(x)) / (max(x) - min(x))
}
write.table(data, file = "data/realworld-all-mammals-milk-1956.csv", sep = ",", row.names = FALSE)

data(life.expectancy.1971)
data <- data.frame(life.expectancy.1971)
for (c in colnames(data)) {
    x <- as.numeric(data[, c])
    data[, c] <- (x - min(x)) / (max(x) - min(x))
}
write.table(data, file = "data/realworld-life-expectancy-1971.csv", sep = ",", row.names = FALSE)

data(mutation.distances.1967)
data <- data.frame(mutation.distances.1967)
for (c in colnames(data)) {
    x <- as.numeric(data[, c])
    data[, c] <- (x - min(x)) / (max(x) - min(x))
}
write.table(data, file = "data/realworld-mutation-distances-1967.csv", sep = ",", row.names = FALSE)

data(rda.meat.fish.fowl.1959)
data <- data.frame(rda.meat.fish.fowl.1959)
for (c in colnames(data)) {
    x <- as.numeric(data[, c])
    data[, c] <- (x - min(x)) / (max(x) - min(x))
}
write.table(data, file = "data/realworld-rda-meat-fish-fowl-1959.csv", sep = ",", row.names = FALSE)

data(sample.mammals.milk.1956)
data <- data.frame(sample.mammals.milk.1956)
for (c in colnames(data)) {
    x <- as.numeric(data[, c])
    data[, c] <- (x - min(x)) / (max(x) - min(x))
}
write.table(data, file = "data/realworld-sample-mammals-milk-1956.csv", sep = ",", row.names = FALSE)

data(us.south.demographics.1965)
data <- data.frame(us.south.demographics.1965)
for (c in colnames(data)) {
    x <- as.numeric(data[, c])
    data[, c] <- (x - min(x)) / (max(x) - min(x))
}
write.table(data, file = "data/realworld-us-south-demographics-1965.csv", sep = ",", row.names = FALSE)

data(mammal.dentition)
data <- data.frame(mammal.dentition)
for (c in colnames(data)) {
    x <- as.numeric(data[, c])
    data[, c] <- (x - min(x)) / (max(x) - min(x))
}
write.table(data, file = "data/realworld-mammal-dentition.csv", sep = ",", row.names = FALSE)